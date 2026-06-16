"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { organizations, type Organization } from "@/mocks/organizations";

interface OrganizationContextValue {
  organizations: Organization[];
  currentOrganization: Organization;
  setCurrentOrganizationId: (id: string) => void;
  setOrganizationStatus: (id: string, status: Organization["status"]) => void;
}

const OrganizationContext = createContext<OrganizationContextValue | null>(null);

export function OrganizationProvider({ children }: { children: React.ReactNode }) {
  const [organizationItems, setOrganizationItems] = useState(organizations);
  const [currentOrganizationId, setCurrentOrganizationId] = useState(organizations[0].id);
  const currentOrganization = organizationItems.find((item) => item.id === currentOrganizationId) || organizationItems[0];
  const setOrganizationStatus = (id: string, status: Organization["status"]) => {
    setOrganizationItems((items) => items.map((item) => item.id === id ? { ...item, status } : item));
    if (id === currentOrganizationId && status === "已停用") {
      const next = organizationItems.find((item) => item.id !== id && item.status === "正常");
      if (next) setCurrentOrganizationId(next.id);
    }
  };
  const value = useMemo(
    () => ({ organizations: organizationItems, currentOrganization, setCurrentOrganizationId, setOrganizationStatus }),
    [currentOrganization, organizationItems],
  );

  return <OrganizationContext.Provider value={value}>{children}</OrganizationContext.Provider>;
}

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (!context) throw new Error("useOrganization must be used within OrganizationProvider");
  return context;
}
