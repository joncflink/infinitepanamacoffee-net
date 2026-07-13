import type { Metadata } from "next";
import {
  getPlannedInventory,
  getInboundInventory,
  getSellableInventory,
  getUnavailableCoffees,
  getAmazonApprovalTracked,
  canReleaseFullProduction,
  getFullName,
  formatPassportDisplay,
  type Coffee,
} from "@/data/coffees";

export const metadata: Metadata = {
  title: "Inventory",
  robots: { index: false, follow: false },
};

/** Reads a yes/no signal out of free-text notes without false-positiving on a negation like "no substitute has been offered." */
function substituteOfferedFrom(notes: string | undefined): string | undefined {
  if (!notes) return undefined;
  const lower = notes.toLowerCase();
  if (!lower.includes("substitute")) return undefined;
  return lower.includes("no substitute") ? "None offered" : "See notes";
}

/** Never "Pending"/"N/A" — an honestly-absent value renders as an em dash. */
function Field({ label, value }: { label: string; value: string | number | undefined }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-t border-gold/15 py-1.5 text-sm first:border-t-0 first:pt-0">
      <dt className="text-soft-gray">{label}</dt>
      <dd className="text-right font-medium text-charcoal">
        {value === undefined || value === "" ? "—" : value}
      </dd>
    </div>
  );
}

function CoffeeCard({ coffee, fields }: { coffee: Coffee; fields: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-gold/25 px-6 py-5">
      <p className="font-heading text-lg text-forest">{getFullName(coffee)}</p>
      <dl className="mt-3">{fields}</dl>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p className="text-sm italic text-soft-gray">{text}</p>;
}

/**
 * Red/amber/green state, always paired with an explicit text label and a
 * distinct glyph (✓/!/✗) — never color alone, so the state still reads
 * correctly for colorblind users or in a screenshot without color.
 */
function StatusBadge({ level, text }: { level: "green" | "amber" | "red"; text: string }) {
  const glyph = level === "green" ? "✓" : level === "amber" ? "!" : "✗";
  const color = level === "green" ? "#2F5D3A" : level === "amber" ? "#B8860B" : "#B3413B";
  return (
    <span className="inline-flex items-center gap-1 font-medium" style={{ color }}>
      <span aria-hidden="true">{glyph}</span>
      {text}
    </span>
  );
}

function approvalStatusBadge(status: string | undefined) {
  if (status === "approved") return <StatusBadge level="green" text="Approved" />;
  if (status === "denied") return <StatusBadge level="red" text="Denied" />;
  if (!status || status === "not_started") return <StatusBadge level="amber" text="Not Started" />;
  return <StatusBadge level="amber" text={status.replace(/_/g, " ")} />;
}

export default function InventoryPage() {
  const planned = getPlannedInventory();
  const inbound = getInboundInventory();
  const sellable = getSellableInventory();
  const unavailable = getUnavailableCoffees();
  const amazonApprovalTracked = getAmazonApprovalTracked();

  return (
    <main className="mx-auto max-w-2xl px-6 py-16 text-dark-gray">
      <p className="text-xs tracking-[0.3em] text-soft-gray">
        INTERNAL SOURCING / INVENTORY TRACKING
      </p>
      <h1 className="mt-3 font-heading text-2xl text-forest">Inventory</h1>
      <p className="mt-4 max-w-xl text-sm leading-6 text-charcoal">
        Not linked from site navigation, not indexed by search engines. Reads
        live from <code>data/coffees.ts</code> — supplier pricing and
        internal quantities shown here are never rendered on any public
        page.
      </p>

      <section className="mt-12">
        <p className="text-xs font-medium tracking-[0.2em] text-soft-gray">
          AMAZON APPROVAL
        </p>
        <div className="mt-4 space-y-4">
          {amazonApprovalTracked.length === 0 ? (
            <EmptyState text="No coffees currently require Amazon category approval." />
          ) : (
            amazonApprovalTracked.map((coffee) => {
              const gate = canReleaseFullProduction(coffee);
              return (
                <div key={coffee.id} className="rounded-lg border border-gold/25 px-6 py-5">
                  <p className="font-heading text-lg text-forest">{getFullName(coffee)}</p>
                  <dl className="mt-3">
                    <Field label="ASIN" value={coffee.asin} />
                    <Field label="Amazon SKU" value={coffee.amazonSku} />
                    <Field label="Category" value={coffee.amazonCategory} />
                    <div className="flex items-baseline justify-between gap-4 border-t border-gold/15 py-1.5 text-sm">
                      <dt className="text-soft-gray">Listing Status</dt>
                      <dd>
                        {coffee.amazonListingStatus === "active" ? (
                          <StatusBadge level="green" text="Active" />
                        ) : (
                          <StatusBadge level="amber" text="Inactive" />
                        )}
                      </dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-4 border-t border-gold/15 py-1.5 text-sm">
                      <dt className="text-soft-gray">Approval Required</dt>
                      <dd>{coffee.amazonApprovalRequired ? "Yes" : "No"}</dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-4 border-t border-gold/15 py-1.5 text-sm">
                      <dt className="text-soft-gray">Approval Status</dt>
                      <dd>{approvalStatusBadge(coffee.amazonApprovalStatus)}</dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-4 border-t border-gold/15 py-1.5 text-sm">
                      <dt className="text-soft-gray">Invoice Status</dt>
                      <dd>
                        {coffee.approvalLot?.invoiceReceived ? (
                          <StatusBadge level="green" text="Received" />
                        ) : (
                          <StatusBadge level="amber" text="Not Received" />
                        )}
                      </dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-4 border-t border-gold/15 py-1.5 text-sm">
                      <dt className="text-soft-gray">Application Status</dt>
                      <dd>
                        {coffee.approvalLot?.applicationSubmitted ? (
                          <StatusBadge level="green" text="Submitted" />
                        ) : (
                          <StatusBadge level="amber" text="Not Submitted" />
                        )}
                      </dd>
                    </div>
                    {coffee.amazonDenialReason && (
                      <Field label="Denial Reason" value={coffee.amazonDenialReason} />
                    )}
                    <div className="flex items-baseline justify-between gap-4 border-t border-gold/15 py-1.5 text-sm">
                      <dt className="text-soft-gray">Production Gate</dt>
                      <dd>
                        {gate.canRelease ? (
                          <StatusBadge level="green" text="Cleared" />
                        ) : (
                          <StatusBadge level="red" text="Blocked" />
                        )}
                      </dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-4 border-t border-gold/15 py-1.5 text-sm">
                      <dt className="text-soft-gray">Alternate-Channel Readiness</dt>
                      <dd>
                        {coffee.alternateChannels?.some((c) => c.status === "ready" || c.status === "active") ? (
                          <StatusBadge level="green" text="At least one ready" />
                        ) : (
                          <StatusBadge level="amber" text="None ready yet" />
                        )}
                      </dd>
                    </div>
                  </dl>
                  {!gate.canRelease && (
                    <div className="mt-3 border-t border-gold/15 pt-3">
                      <p className="text-xs font-medium tracking-[0.15em] text-soft-gray">
                        BLOCKING FULL PRODUCTION RELEASE
                      </p>
                      <ul className="mt-2 space-y-1 text-xs text-charcoal">
                        {gate.missingConditions.map((reason) => (
                          <li key={reason}>— {reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>

      <section className="mt-12">
        <p className="text-xs font-medium tracking-[0.2em] text-soft-gray">
          PLANNED INVENTORY
        </p>
        <div className="mt-4 space-y-4">
          {planned.length === 0 ? (
            <EmptyState text="No coffees currently planned." />
          ) : (
            planned.map((coffee) => (
              <CoffeeCard
                key={coffee.id}
                coffee={coffee}
                fields={
                  <>
                    <Field label="Requested Quantity" value={coffee.requestedQuantityLb ? `${coffee.requestedQuantityLb} lb` : undefined} />
                    <Field label="Quoted Price" value={coffee.quotedPricePerLb ? `$${coffee.quotedPricePerLb.toFixed(2)}/lb` : undefined} />
                    <Field label="Availability" value={coffee.availabilityStatus} />
                    <Field label="Next Action" value="Confirm purchase decision" />
                  </>
                }
              />
            ))
          )}
        </div>
      </section>

      <section className="mt-12">
        <p className="text-xs font-medium tracking-[0.2em] text-soft-gray">
          INBOUND INVENTORY
        </p>
        <div className="mt-4 space-y-4">
          {inbound.length === 0 ? (
            <EmptyState text="No coffees currently ordered or inbound." />
          ) : (
            inbound.map((coffee) => (
              <CoffeeCard
                key={coffee.id}
                coffee={coffee}
                fields={
                  <>
                    <Field label="Ordered Quantity" value={coffee.purchasedQuantityLb ? `${coffee.purchasedQuantityLb} lb` : undefined} />
                    <Field label="Expected Receipt" value={undefined} />
                    <Field label="Lot Number" value={coffee.lotNumber} />
                    <Field label="Passport Number" value={coffee.legacyPassport || !coffee.passportNumber.startsWith("PENDING-") ? formatPassportDisplay(coffee) : undefined} />
                    <Field label="Status" value={coffee.inventoryStatus} />
                  </>
                }
              />
            ))
          )}
        </div>
      </section>

      <section className="mt-12">
        <p className="text-xs font-medium tracking-[0.2em] text-soft-gray">
          SELLABLE INVENTORY
        </p>
        <div className="mt-4 space-y-4">
          {sellable.length === 0 ? (
            <EmptyState text="No coffees currently sellable." />
          ) : (
            sellable.map((coffee) => (
              <CoffeeCard
                key={coffee.id}
                coffee={coffee}
                fields={
                  <>
                    <Field label="Received Quantity" value={coffee.receivedQuantityLb ? `${coffee.receivedQuantityLb} lb` : undefined} />
                    <Field label="Reserved Quantity" value={coffee.reservedQuantityLb ? `${coffee.reservedQuantityLb} lb` : undefined} />
                    <Field label="Available Quantity" value={coffee.availableQuantityLb ? `${coffee.availableQuantityLb} lb` : undefined} />
                    <Field label="Amazon SKU" value={coffee.sizeOptions.find((s) => s.sku)?.sku} />
                    <Field label="FBA Status" value={coffee.inventoryStatus} />
                  </>
                }
              />
            ))
          )}
        </div>
      </section>

      <section className="mt-12">
        <p className="text-xs font-medium tracking-[0.2em] text-soft-gray">
          UNAVAILABLE COFFEES
        </p>
        <div className="mt-4 space-y-4">
          {unavailable.length === 0 ? (
            <EmptyState text="No coffees currently marked unavailable." />
          ) : (
            unavailable.map((coffee) => (
              <CoffeeCard
                key={coffee.id}
                coffee={coffee}
                fields={
                  <>
                    <Field label="Last Known Status" value={coffee.availabilityStatus} />
                    <Field label="Substitute Offered" value={substituteOfferedFrom(coffee.notes)} />
                    <Field label="Notes" value={coffee.notes} />
                  </>
                }
              />
            ))
          )}
        </div>
      </section>
    </main>
  );
}
