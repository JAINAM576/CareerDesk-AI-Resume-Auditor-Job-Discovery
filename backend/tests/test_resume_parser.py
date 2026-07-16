import pytest
from app.services.resume_parser import validate_file, ResumeParserError
from app.config import settings

def test_validate_file_invalid_extension():
    # .txt is not allowed
    with pytest.raises(ResumeParserError) as excinfo:
        validate_file("test.txt", 100)
    assert "Unsupported file format" in str(excinfo.value)

def test_validate_file_oversized():
    # 6MB exceeds the 5MB limit
    oversized_bytes = 6 * 1024 * 1024
    with pytest.raises(ResumeParserError) as excinfo:
        validate_file("test.pdf", oversized_bytes)
    assert "exceeds limit" in str(excinfo.value)

def test_validate_file_valid():
    # Valid file format and size
    try:
        validate_file("resume.pdf", 1 * 1024 * 1024)
    except ResumeParserError:
        pytest.fail("validate_file raised ResumeParserError on valid file")

def test_extract_text_pdfplumber(mocker):
    mock_pdf = mocker.patch("pdfplumber.open")
    mock_pdf.return_value.__enter__.return_value.pages = [
        mocker.Mock(extract_text=mocker.Mock(return_value="Extracted text from PDF"))
    ]
    
    from app.services.resume_parser import extract_text_from_pdf_plumber
    res = extract_text_from_pdf_plumber(b"dummy bytes")
    assert res == "Extracted text from PDF"

def test_extract_text_mineru_success(mocker):
    # Mock settings variables
    settings.USE_MINERU_PARSER = True
    settings.MINERU_API_TOKEN = "test_token"
    
    # Mock MarkItDown to return empty to force MinerU fallback
    mock_mid = mocker.patch("markitdown.MarkItDown")
    mock_mid.return_value.convert_stream.return_value = mocker.Mock(text_content="")
    
    # Mock upload function
    mocker.patch("app.services.resume_parser.upload_to_tmpfiles", return_value="https://tmpfiles.org/dl/123/resume.pdf")
    
    # Mock task submission endpoint
    mock_post = mocker.patch("requests.post")
    mock_post.return_value = mocker.Mock(
        status_code=200,
        json=lambda: {"code": 0, "msg": "success", "data": {"task_id": "test_task_id"}}
    )
    
    # Mock status polling & download
    mock_get = mocker.patch("requests.get")
    mock_get.side_effect = [
        mocker.Mock(status_code=200, json=lambda: {"code": 0, "data": {"state": "done", "full_zip_url": "https://mineru.net/dl/res.zip"}}),
        mocker.Mock(status_code=200, content=b"fake_zip_bytes")
    ]
    
    # Mock zip parsing
    mocker.patch("app.services.resume_parser.parse_zip_for_markdown", return_value="# Parsed Resume Markdown")
    
    from app.services.resume_parser import extract_text_from_pdf
    res = extract_text_from_pdf(b"dummy bytes")
    assert res == "# Parsed Resume Markdown"

def test_extract_text_markitdown_success(mocker):
    # Mock MarkItDown to return a long string
    mock_mid = mocker.patch("markitdown.MarkItDown")
    long_text = "Standard resume text content that exceeds one hundred characters of length so it does not trigger the fallback parser."
    mock_mid.return_value.convert_stream.return_value = mocker.Mock(text_content=long_text)
    
    # Mock file open to prevent file write error during test
    mocker.patch("builtins.open", mocker.mock_open())
    
    from app.services.resume_parser import extract_text_from_pdf
    res = extract_text_from_pdf(b"dummy bytes")
    assert res == long_text

