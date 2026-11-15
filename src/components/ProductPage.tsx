import { CheckCircleIcon } from "@/components/icons";
import { ButtonLink, Eyebrow } from "@/components/ui";
import type { Product } from "@/content/products";
import { formatINR } from "@/lib/format";

/** Shared layout for every product sales page. */
export default function ProductPage({ product }: { product: Product }) {
  return (
    <section aria-labelledby="product-title" className="px-6 pb-20 pt-12 md:pb-26 md:pt-18">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-start gap-x-16 gap-y-10">
        <div className="flex min-w-0 flex-[1.3_1_380px] flex-col items-start gap-6">
          <Eyebrow>{product.eyebrow}</Eyebrow>
          <h1
            id="product-title"
            className="m-0 font-serif text-[clamp(48px,6vw,84px)] font-medium leading-none tracking-[-0.01em]"
          >
            {product.title}
          </h1>
          <p className="m-0 max-w-[600px] text-[19px] text-ink-soft">{product.intro}</p>

          <div className="mt-4 flex w-full flex-col gap-4 border-t border-sand pt-6">
            <h2 className="m-0 text-xs font-semibold uppercase tracking-[0.22em] text-ink-soft">{product.includesTitle}</h2>
            <ul className="m-0 flex list-none flex-col gap-3.5 p-0 text-base leading-[1.4]">
              {product.includes.map((item) => (
                <li key={item} className="flex gap-3">
                  <CheckCircleIcon className="flex-none text-ink" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside
          aria-label="Price"
          className="flex min-w-0 flex-[1_1_320px] flex-col gap-4 rounded-[28px] border border-ink bg-white p-7 sm:p-9 lg:sticky lg:top-32"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">{product.priceLabel}</span>
          <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
            <span className="font-serif text-[68px] font-medium leading-none">{formatINR(product.price.amount)}</span>
            {product.price.gst === "extra" && <span className="pb-2 text-lg text-ink-soft">+ GST</span>}
          </div>
          {product.price.gst === "included" && <span className="text-sm text-ink-soft">Includes GST.</span>}
          <hr className="m-0 border-0 border-t border-line" />
          <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[15px] text-ink-soft">
            {product.priceNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
          <ButtonLink href={product.cta.href} external={product.cta.external} className="mt-2 self-stretch">
            {product.cta.label}
          </ButtonLink>
          {product.ctaNote && <span className="text-center text-sm text-ink-soft">{product.ctaNote}</span>}
        </aside>
      </div>
    </section>
  );
}
