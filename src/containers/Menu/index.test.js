import { fireEvent, render, screen } from "@testing-library/react";
import Menu from "./index";

describe("When Menu is created", () => {
  it("a list of mandatories links and the logo are displayed", async () => {
    render(<Menu />);
    await screen.findByText("Nos services");
    await screen.findByText("Nos réalisations");
    await screen.findByText("Notre équipe");
    await screen.findByText("Contact");
  });

  describe("and a click is triggered on contact button", () => {  // Bouton Contact
    it("document location  href change", async () => {
      render(<Menu />);
      fireEvent(
        await screen.findByText("Contact"),
        new MouseEvent("click", {
          cancelable: true,
          bubbles: true,
        })
      );
      expect(window.document.location.hash).toEqual("#contact");  
    });
  });

  describe("and a click is triggered on nos-services link", () => { // Bouton nos-services
    it("href of Nos services link is correct", async () => {
      render(<Menu />);
      const link = await screen.findByText("Nos services");
      expect(link).toHaveAttribute("href", "#nos-services");
    });
  });

  describe("and a click is triggered on nos-realisations link", () => { // Bouton nos-realisationss
    it("href of Nos réalisations link is correct", async () => {
      render(<Menu />);
      const link = await screen.findByText("Nos réalisations");
      expect(link).toHaveAttribute("href", "#nos-realisations");
    });
  });

  describe("and a click is triggered on notre-equipe link", () => { // Bouton notre-equipe
    it("href of Notre équipe link is correct", async () => {
      render(<Menu />);
      const link = await screen.findByText("Notre équipe");
      expect(link).toHaveAttribute("href", "#notre-equipe");
    });
  });
});
