import React, { useState, useEffect, useMemo, useRef } from "react";
import apiClient from "../../api/client";

// Custom Searchable Dropdown Component
function SearchableSelect({ label, value, options, onChange, placeholder, disabled, isLoading }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    return options.filter(opt => {
      const optName = opt.name || opt;
      return optName.toLowerCase().includes(search.toLowerCase());
    });
  }, [search, options]);

  // Translate code value to display name
  const displayValue = useMemo(() => {
    if (!value) return "";
    const found = options.find(opt => (opt.iso2 || opt.name || opt) === value);
    return found ? (found.name || found) : value;
  }, [value, options]);

  return (
    <div ref={containerRef} className="flex flex-col gap-1.5 min-w-0 relative">
      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 select-none text-left">
        {label}
      </label>
      
      {/* Dropdown Input Trigger */}
      <div
        onClick={() => !disabled && !isLoading && setIsOpen(!isOpen)}
        className={`form-input text-xs !py-2.5 flex justify-between items-center cursor-pointer select-none bg-white border rounded-xl transition-all ${
          disabled || isLoading ? "opacity-50 cursor-not-allowed bg-slate-50" : "hover:border-slate-300"
        }`}
      >
        <span className="truncate font-semibold text-slate-800">
          {displayValue || placeholder}
        </span>
        <span className="text-slate-400 text-[8px] font-bold">
          {isOpen ? "▲" : "▼"}
        </span>
      </div>

      {/* Floating Card options list */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-[999] p-2 flex flex-col gap-2 max-h-56">
          {/* Search Bar Input */}
          <input
            type="text"
            className="form-input text-xs !py-1.5 px-2 bg-slate-50 border-slate-200 w-full"
            placeholder="Type to filter..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          
          {/* Scrollable Container */}
          <div className="overflow-y-auto flex-grow max-h-36 pr-1 space-y-0.5">
            {filteredOptions.length === 0 ? (
              <div className="text-center py-4 text-xs font-semibold text-slate-400">
                No matches found
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const optVal = opt.iso2 || opt.name || opt;
                const optName = opt.name || opt;
                return (
                  <div
                    key={optVal}
                    onClick={() => {
                      onChange({ target: { value: optVal } });
                      setIsOpen(false);
                      setSearch("");
                    }}
                    className={`p-2 rounded-lg text-xs cursor-pointer transition-colors text-left truncate ${
                      value === optVal
                        ? "bg-blue-600 text-white font-bold"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {optName}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LocationSelector({ value, onChange, disabled }) {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  // Fetch countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      setIsLoadingCountries(true);
      try {
        const res = await apiClient.get("/location/countries");
        const sorted = (res.data || []).sort((a, b) => a.name.localeCompare(b.name));
        setCountries(sorted);
      } catch (err) {
        console.error("Failed to load countries:", err);
      } finally {
        setIsLoadingCountries(false);
      }
    };
    fetchCountries();
  }, []);

  // Sync if value is cleared externally
  useEffect(() => {
    if (!value) {
      setSelectedCountry("");
      setSelectedState("");
      setSelectedCity("");
      setStates([]);
      setCities([]);
    }
  }, [value]);

  const handleCountryChange = async (e) => {
    const countryIso = e.target.value;
    setSelectedCountry(countryIso);
    setSelectedState("");
    setSelectedCity("");
    setStates([]);
    setCities([]);

    const countryObj = countries.find((c) => c.iso2 === countryIso);
    const countryName = countryObj ? countryObj.name : "";
    onChange(countryName);

    if (countryIso) {
      setIsLoadingStates(true);
      try {
        const res = await apiClient.get(`/location/countries/${countryIso}/states`);
        const sorted = (res.data || []).sort((a, b) => a.name.localeCompare(b.name));
        setStates(sorted.slice(0, 250));
      } catch (err) {
        console.error("Failed to load states:", err);
      } finally {
        setIsLoadingStates(false);
      }
    }
  };

  const handleStateChange = async (e) => {
    const stateIso = e.target.value;
    setSelectedState(stateIso);
    setSelectedCity("");
    setCities([]);

    const countryObj = countries.find((c) => c.iso2 === selectedCountry);
    const stateObj = states.find((s) => s.iso2 === stateIso);
    const combined = stateObj && countryObj 
      ? `${stateObj.name}, ${countryObj.name}` 
      : countryObj ? countryObj.name : "";
    onChange(combined);

    if (selectedCountry && stateIso) {
      setIsLoadingCities(true);
      try {
        const res = await apiClient.get(`/location/countries/${selectedCountry}/states/${stateIso}/cities`);
        const sorted = (res.data || []).sort((a, b) => a.name.localeCompare(b.name));
        setCities(sorted.slice(0, 250));
      } catch (err) {
        console.error("Failed to load cities:", err);
      } finally {
        setIsLoadingCities(false);
      }
    }
  };

  const handleCityChange = (e) => {
    const cityName = e.target.value;
    setSelectedCity(cityName);

    const countryObj = countries.find((c) => c.iso2 === selectedCountry);
    const stateObj = states.find((s) => s.iso2 === selectedState);
    
    let combined = "";
    if (cityName && stateObj && countryObj) {
      combined = `${cityName}, ${stateObj.name}, ${countryObj.name}`;
    } else if (stateObj && countryObj) {
      combined = `${stateObj.name}, ${countryObj.name}`;
    } else if (countryObj) {
      combined = countryObj.name;
    }
    onChange(combined);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 w-full text-left">
      {/* Country Select */}
      <SearchableSelect
        label="Country"
        value={selectedCountry}
        options={countries}
        onChange={handleCountryChange}
        placeholder="Select Country"
        disabled={disabled}
        isLoading={isLoadingCountries}
      />

      {/* State Select */}
      <SearchableSelect
        label="State / Region"
        value={selectedState}
        options={states}
        onChange={handleStateChange}
        placeholder="Select State"
        disabled={disabled || !selectedCountry}
        isLoading={isLoadingStates}
      />

      {/* City Select */}
      <SearchableSelect
        label="City"
        value={selectedCity}
        options={cities}
        onChange={handleCityChange}
        placeholder="Select City"
        disabled={disabled || !selectedState}
        isLoading={isLoadingCities}
      />
    </div>
  );
}
