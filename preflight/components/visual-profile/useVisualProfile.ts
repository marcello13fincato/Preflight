/**
 * useVisualProfile Hook
 * 
 * Manage visual profile state, fetching, and updates
 */

"use client";

import { useState, useEffect } from "react";
import { VisualProfile } from "@/lib/visual-profile/utils";
import { DEFAULT_VISUAL_PROFILE } from "@/lib/visual-profile/constants";

export function useVisualProfile() {
  const [profile, setProfile] = useState<VisualProfile | null>(null);
  const [presets, setPresets] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch visual profile and presets on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileRes, presetsRes] = await Promise.all([
          fetch("/api/visual-profile"),
          fetch("/api/visual-profile/presets"),
        ]);

        if (!profileRes.ok) throw new Error("Failed to fetch profile");
        if (!presetsRes.ok) throw new Error("Failed to fetch presets");

        const profileData = await profileRes.json();
        const presetsData = await presetsRes.json();

        setProfile(profileData);
        setPresets(presetsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching visual profile:", err);
        setError(err instanceof Error ? err.message : "Failed to load profile");
        // Set defaults
        setProfile(DEFAULT_VISUAL_PROFILE as VisualProfile);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update visual profile
  const updateProfile = async (updates: Partial<VisualProfile>) => {
    try {
      setIsSaving(true);
      const res = await fetch("/api/visual-profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update profile");
      }

      const updated = await res.json();
      setProfile(updated);
      return updated;
    } catch (err) {
      console.error("Error updating visual profile:", err);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    profile,
    presets,
    loading,
    error,
    isSaving,
    updateProfile,
  };
}
