import { render, screen } from "@testing-library/react";
import { DataProvider, api, useData } from "./index";

describe("When a data context is created", () => {
  it("a call is executed on the events.json file", async () => {
    api.loadData = jest.fn().mockResolvedValue({ 
       // Ici, j'ai ajouté un tableau d'événements avec une date et un titre,
      events: [{ date: "2024-01-01", title: "Event 1" }], 
      result: "ok" // Propriété result ajoutée pour le test
    });
    const Component = () => {
      const { data } = useData();
      return <div>{data?.result}</div>;
    };
    render(
      <DataProvider>
        <Component />
      </DataProvider>
    );
    const dataDisplayed = await screen.findByText("ok");
    expect(dataDisplayed).toBeInTheDocument();
  });
  describe("and the events call failed", () => {
    it("the error is dispatched", async () => {
      window.console.error = jest.fn();
      api.loadData = jest.fn().mockRejectedValue("error on calling events");

      const Component = () => {
        const { error } = useData();
        return <div>{error}</div>;
      };
      render(
        <DataProvider>
          <Component />
        </DataProvider>
      );
      const dataDisplayed = await screen.findByText("error on calling events");
      expect(dataDisplayed).toBeInTheDocument();
    });
  });
  it("api.loadData", () => {
    window.console.error = jest.fn();
    global.fetch = jest.fn().mockResolvedValue(() =>
      Promise.resolve({
        json: () => Promise.resolve({ events: [{ date: "2024-09-24" }] }), // Simule la structure des données
      })
    );
    const Component = () => {
      const { error } = useData();
      return <div>{error}</div>;
    };
    render(
      <DataProvider>
        <Component />
      </DataProvider>
    );
  });
});
