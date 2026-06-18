describe("Learner Registration", () => {
  function fillBasicDetails(email: string) {
    cy.visit("/dashboard/");
    cy.contains("Sign up").click();
    cy.wait(2000);

    cy.get('input[placeholder="Enter your full name"]').type("Maya VK");

    cy.get('input[placeholder="Email address"]').type(email);

    cy.get('input[placeholder="Create password"]').type("TestPass123!");

    cy.get('input[placeholder="Re-enter password"]').type("TestPass123!");

    cy.contains("Continue").click();

    cy.contains("Learner").click();
    cy.contains("Continue").click();
  }

  it("Register as College Student", () => {
    fillBasicDetails(`college${Date.now()}@example.com`);

    cy.contains("button", "College").click();

    // College dropdown
    cy.get('input[data-slot="input"]').eq(0).click();
    cy.wait(1000);
    cy.get(".p-1 > :nth-child(1)").click();

    // Department dropdown
    cy.get('input[data-slot="input"]').eq(1).click();
    cy.wait(1000);
    cy.get(".p-1 > :nth-child(1)").click();

    // Graduation Year
    cy.get('input[placeholder="e.g., 2025"]').type("2026");

    cy.contains("Complete Registration").should("be.visible").click();

    cy.url().should("not.include", "/register");

    cy.wait(2000);
  });

  it("Register as Organization Representative and follow-ups", () => {
    fillBasicDetails(`Organization${Date.now()}@example.com`);

    cy.contains("button", "Organization").click();

    // Organization dropdown
    cy.get('input[data-slot="input"]').eq(0).click();
    cy.wait(1000);
    cy.get(".p-1 > :nth-child(1)").click();

    cy.contains("Complete Registration").should("be.visible").click();

    cy.url().should("not.include", "/register");

    // Follow-up 1: Take the PathFinder Quiz (no re-signup)
    cy.contains("Take the PathFinder Quiz").should("be.visible").click();

    cy.url().should("include", "onboarding/interests");

    const answerFirstOption = () => {
      // select the first option on this question page
      cy.get(".space-y-3.flex-1 button").first().click();

      // click the circular "next" arrow once it's no longer disabled
      cy.get("button:has(svg.lucide-arrow-right)")
        .should("not.be.disabled")
        .click();
    };

    // run this once per question page
    Cypress._.times(5, () => {
      answerFirstOption();
      cy.wait(500);
    });

    cy.contains("Begin your journey").should("be.visible").click();

    cy.wait(2000);

    cy.visit("/onboarding/interests");
    cy.contains("I know what I want").should("be.visible").click();
  });
});
