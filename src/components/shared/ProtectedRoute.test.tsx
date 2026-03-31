import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

const renderProtectedRoute = (initialPath: string, requiredPermission?: string) =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/login" element={<div>Login page</div>} />
        <Route path="/dashboard" element={<div>Dashboard page</div>} />
        <Route
          path="/private"
          element={
            <ProtectedRoute requiredPermission={requiredPermission}>
              <div>Private content</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  );

describe("ProtectedRoute", () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  it("redirects to login when token is missing", async () => {
    renderProtectedRoute("/private");
    expect(await screen.findByText("Login page")).toBeInTheDocument();
  });

  it("renders protected content when token exists and no specific permission is required", async () => {
    sessionStorage.setItem("auth_token", "token-123");

    renderProtectedRoute("/private");
    expect(await screen.findByText("Private content")).toBeInTheDocument();
  });

  it("allows route when user has required permission", async () => {
    sessionStorage.setItem("auth_token", "token-123");
    sessionStorage.setItem(
      "userData",
      JSON.stringify({
        permissions: ["USERS_MANAGE"],
      })
    );

    renderProtectedRoute("/private", "USERS_MANAGE");
    expect(await screen.findByText("Private content")).toBeInTheDocument();
  });

  it("redirects to dashboard when permission is missing", async () => {
    sessionStorage.setItem("auth_token", "token-123");
    sessionStorage.setItem(
      "userData",
      JSON.stringify({
        permissions: ["PATIENTS_VIEW"],
      })
    );

    renderProtectedRoute("/private", "USERS_MANAGE");
    expect(await screen.findByText("Dashboard page")).toBeInTheDocument();
  });
});
