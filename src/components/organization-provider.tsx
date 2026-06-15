"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { organizations, type Organization } from "@/mocks/organizations";

interface OrganizationContextValue {
  organizations: Organization[];
  currentOrganization: Organization;
  setCurrentOrganizationId: (id: string) => void;
}

const OrganizationContext = createContext<OrganizationContextValue | null>(null);

export function OrganizationProvider({ children }: { children: React.ReactNode }) {
  const [currentOrganizationId, setCurrentOrganizationId] = useState(organizations[0].id);
  const currentOrganization = organizations.find((item) => item.id === currentOrganizationId) || organizations[0];
  const value = useMemo(
    () => ({ organizations, currentOrganization, setCurrentOrganizationId }),
    [currentOrganization],
  );

  return <OrganizationContext.Provider value={value}>{children}</OrganizationContext.Provider>;
}

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (!context) throw new Error("useOrganization must be used within OrganizationProvider");
  return context;
}
