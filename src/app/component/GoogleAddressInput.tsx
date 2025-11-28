"use client";
import { useEffect, useRef } from "react";

type GoogleAddressInputProps = {
  value: string;
  onSelect: (result: {
    formatted_address: string;
    place_id?: string;
    lat?: number;
    lng?: number;
  }) => void;
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

  useEffect(() => {
    if (!window.google || !inputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["address"],
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();

      const result = {
        formatted_address: place.formatted_address || "",
        place_id: place.place_id,
        lat: place.geometry?.location?.lat(),
        lng: place.geometry?.location?.lng(),
      };

      onSelect(result);
    });
  }, [onSelect]);

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
