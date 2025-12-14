"use client";
import { useEffect, useRef } from "react";

type GoogleAddressResult = {
  formatted_address: string;
  place_id?: string;
  lat?: number;
  lng?: number;
  address_components?: any[];
};

type GoogleAddressInputProps = {
  value: string;
  onSelect: (result: GoogleAddressResult) => void;
  onChangeText?: (text: string) => void;
};

declare global {
  interface Window {
    google: any;
  }
}

export default function GoogleAddressInput({
  value,
  onSelect,
  onChangeText,
}: GoogleAddressInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onSelectRef = useRef(onSelect);
  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    if (!window.google || !inputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["address"],
        fields: [
          "formatted_address",
          "place_id",
          "address_components",
          "geometry",
        ],
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();

      const result: GoogleAddressResult = {
        formatted_address: place.formatted_address || "",
        place_id: place.place_id,
        lat: place.geometry?.location?.lat(),
        lng: place.geometry?.location?.lng(),
        address_components: place.address_components || [],
      };

      onSelectRef.current(result);

      if (onChangeText) {
        onChangeText(result.formatted_address || "");
      }
    });

    return () => {
      window.google.maps.event.clearInstanceListeners(autocomplete);
    };
  }, []); 

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      placeholder="Search address..."
      className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm"
      onChange={(e) => {
        onChangeText?.(e.target.value);
      }}
    />
  );
}
