import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "periscope",
  name: "Periscope",
});

// Event type definitions
export type DealCreatedEvent = {
  name: "periscope/deal.created";
  data: {
    dealId: string;
  };
};

export type PeriscopeEvents = {
  "periscope/deal.created": DealCreatedEvent;
};
