import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { CongressCard } from "@/components/domain/CongressCard";
import type { CongressSummary } from "@/types/congress";

const MOCK_CONGRESS: CongressSummary = {
  id: "11111111-0000-0000-0000-000000000001",
  name: "Congreso de Inteligencia Artificial",
  description: "Conferencia sobre IA aplicada",
  startDate: "2026-06-01",
  endDate: "2026-06-03",
  location: "Guatemala City",
  price: 150,
  institutionId: "22222222-0000-0000-0000-000000000001",
  institutionName: "Universidad Galileo",
  createdBy: "33333333-0000-0000-0000-000000000001",
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
};

describe("CongressCard", () => {
  it("renders the congress name", () => {
    render(<CongressCard congress={MOCK_CONGRESS} />);
    expect(screen.getByTestId("congress-card-name")).toHaveTextContent(
      "Congreso de Inteligencia Artificial",
    );
  });

  it("renders the formatted price", () => {
    render(<CongressCard congress={MOCK_CONGRESS} />);
    const priceEl = screen.getByTestId("congress-card-price");
    expect(priceEl.textContent).toMatch(/150|Q/);
  });

  it("renders the start date in the date range", () => {
    render(<CongressCard congress={MOCK_CONGRESS} />);
    const dates = screen.getByTestId("congress-card-dates");
    expect(dates.textContent).toMatch(/2026|Jun/i);
  });

  it("renders institution name", () => {
    render(<CongressCard congress={MOCK_CONGRESS} />);
    expect(screen.getByTestId("congress-card-institution")).toHaveTextContent(
      "Universidad Galileo",
    );
  });

  it("has a detail link pointing to the congress id", () => {
    render(<CongressCard congress={MOCK_CONGRESS} />);
    const link = screen.getByTestId("congress-card-detail-link");
    expect(link.getAttribute("href")).toContain(MOCK_CONGRESS.id);
  });
});
