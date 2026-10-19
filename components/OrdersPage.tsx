"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Check,
  Eye,
  LogIn,
  Package,
  RefreshCw,
  RotateCcw,
  Search,
  ShoppingBag,
  ShoppingCart,
  Truck,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */

type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
type StatusFilter = "all" | OrderStatus;
type DateFilter = "30d" | "3m" | "1y" | "all";
type SortOption = "newest" | "oldest" | "price-desc" | "price-asc";

interface OrderRow {
  id: string;
  user_id: string;
  product_id: string | null;
  product_name: string | null;
  price: number | null;
  quantity: number | null;
  total_amount: number | null;
  status: string | null;
  created_at: string;
}

interface ProductRow {
  id: string;
  name: string | null;
  image_url: string | null;
  category: string | null;
  price: number | null;
}

interface Order extends OrderRow {
  product: ProductRow | null;
}

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatINR(value: number | null | undefined): string {
  const numeric = Number(value ?? 0);
  return inrFormatter.format(Number.isFinite(numeric) ? numeric : 0);
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function shortOrderId(id: string): string {
  return `#${id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

function normalizeStatus(status: string | null | undefined): OrderStatus {
  const value = (status ?? "").toLowerCase().trim();
  if (
    value === "pending" ||
    value === "confirmed" ||
    value === "shipped" ||
    value === "delivered" ||
    value === "cancelled"
  ) {
    return value;
  }
  return "pending";
}

function orderAmount(order: OrderRow): number {
  const unit = Number(order.price ?? 0);
  const qty = Number(order.quantity ?? 1);
  const total = order.total_amount;
  if (total === null || total === undefined) return unit * qty;
  const numericTotal = Number(total);
  return Number.isFinite(numericTotal) ? numericTotal : unit * qty;
}

/* ------------------------------------------------------------------ */
/*  STATUS CONFIG                                                      */
/* ------------------------------------------------------------------ */

const STATUS_META: Record<
  OrderStatus,
  { label: string; badge: string; dot: string; solid: string; text: string }
> = {
  pending: {
    label: "Pending",
    badge: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    dot: "bg-amber-500",
    solid: "border-amber-500 bg-amber-500",
    text: "text-amber-600",
  },
  confirmed: {
    label: "Confirmed",
    badge: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    dot: "bg-blue-500",
    solid: "border-blue-500 bg-blue-500",
    text: "text-blue-600",
  },
  shipped: {
    label: "Shipped",
    badge: "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
    dot: "bg-violet-500",
    solid: "border-violet-500 bg-violet-500",
    text: "text-violet-600",
  },
  delivered: {
    label: "Delivered",
    badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    dot: "bg-emerald-500",
    solid: "border-emerald-500 bg-emerald-500",
    text: "text-emerald-600",
  },
  cancelled: {
    label: "Cancelled",
    badge: "bg-red-50 text-red-700 ring-1 ring-red-200",
    dot: "bg-red-500",
    solid: "border-red-500 bg-red-500",
    text: "text-red-600",
  },
};

const TRACK_MESSAGES: Record<OrderStatus, string> = {
  pending:
    "Your order has been placed successfully and is waiting to be confirmed by the seller.",
  confirmed:
    "Your order is confirmed and is currently being processed.",
  shipped:
    "Your order has been shipped and is on its way to you.",
  delivered:
    "Your order has been delivered. We hope you love your purchase!",
  cancelled:
    "This order was cancelled. If a payment was made, any refund will be processed to your original payment method.",
};

const STATUS_TABS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "All Orders" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

const TRACKER_STEPS: { key: OrderStatus; label: string }[] = [
  { key: "pending", label: "Order Placed" },
  { key: "confirmed", label: "Confirmed" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

/* ------------------------------------------------------------------ */
/*  SMALL REUSABLE PIECES                                              */
/* ------------------------------------------------------------------ */

function ProductThumb({
  src,
  alt,
  className = "",
}: {
  src?: string | null;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  const showImage = Boolean(src) && !failed;

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 ${className}`}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src as string}
          alt={alt}
          loading="lazy"
          className="h-full w-full object-contain"
          onError={() => setFailed(true)}
        />
      ) : (
        <Package className="h-8 w-8 text-slate-300" />
      )}
    </div>
  );
}

function StatusTracker({ status }: { status: OrderStatus }) {
  const steps =
    status === "cancelled"
      ? [
          { key: "pending" as OrderStatus, label: "Order Placed" },
          { key: "cancelled" as OrderStatus, label: "Cancelled" },
        ]
      : TRACKER_STEPS;

  const foundIndex = steps.findIndex((step) => step.key === status);
  const currentIndex = foundIndex === -1 ? 0 : foundIndex;

  return (
    <ol className="flex items-start">
      {steps.map((step, index) => {
        const isDone = index < currentIndex;
        const isCurrent = index === currentIndex;
        const meta = STATUS_META[step.key];

        return (
          <li
            key={step.key}
            className={index === steps.length - 1 ? "flex-none" : "flex-1"}
          >
            <div className="flex items-center">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition sm:h-9 sm:w-9 ${
                  isDone
                    ? "border-indigo-600 bg-indigo-600 text-white"
                    : isCurrent
                      ? `${meta.solid} text-white`
                      : "border-slate-200 bg-white"
                }`}
              >
                {isDone ? (
                  <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={3} />
                ) : isCurrent ? (
                  <span className="h-2 w-2 rounded-full bg-white sm:h-2.5 sm:w-2.5" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                )}
              </span>

              {index < steps.length - 1 && (
                <span
                  className={`mx-1.5 h-1 flex-1 rounded-full sm:mx-2 ${
                    index < currentIndex ? "bg-indigo-600" : "bg-slate-200"
                  }`}
                />
              )}
            </div>

            <p
              className={`mt-2 pr-1 text-[10px] font-medium leading-tight sm:text-xs ${
                isCurrent
                  ? meta.text
                  : isDone
                    ? "text-slate-700"
                    : "text-slate-400"
              }`}
            >
              {step.label}
            </p>
          </li>
        );
      })}
    </ol>
  );
}

function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = "max-w-lg",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  useEffect(() => {
    if (!open) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 backdrop-blur-sm sm:items-center sm:p-4"
    >
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <div
        className={`relative z-10 max-h-[92vh] w-full ${maxWidth} overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-2xl`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-slate-100 bg-white/95 px-5 py-4 backdrop-blur sm:px-6">
          <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-5 py-5 sm:px-6">{children}</div>
      </div>
    </div>
  );
}

function DetailItem({
  label,
  value,
  valueClassName = "",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p
        className={`mt-1 break-words text-sm font-semibold text-slate-900 ${valueClassName}`}
      >
        {value}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ORDER CARD                                                         */
/* ------------------------------------------------------------------ */

function OrderCard({
  order,
  onViewDetails,
  onTrackOrder,
  onBuyAgain,
}: {
  order: Order;
  onViewDetails: (order: Order) => void;
  onTrackOrder: (order: Order) => void;
  onBuyAgain: (order: Order) => void;
}) {
  const status = normalizeStatus(order.status);
  const meta = STATUS_META[status];
  const product = order.product;

  const name = order.product_name || product?.name || "Product";
  const category = product?.category ?? null;
  const unitPrice = order.price ?? product?.price ?? 0;
  const quantity = order.quantity ?? 1;
  const total = orderAmount(order);
  const productAvailable = Boolean(order.product_id && product);

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      {/* ---------- top summary strip ---------- */}
      <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-b border-slate-100 bg-slate-50/70 px-4 py-4 sm:px-6">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Order Placed
          </p>
          <p className="mt-0.5 text-sm font-medium text-slate-800">
            {formatDate(order.created_at)}
          </p>
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Order ID
          </p>
          <p className="mt-0.5 text-sm font-medium text-slate-800">
            {shortOrderId(order.id)}
          </p>
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Total
          </p>
          <p className="mt-0.5 text-sm font-semibold text-slate-900">
            {formatINR(total)}
          </p>
        </div>

        <div className="ml-auto">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${meta.badge}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
            {meta.label}
          </span>
        </div>
      </div>

      {/* ---------- product + tracker ---------- */}
      <div className="grid gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
        <div className="flex gap-4">
          <ProductThumb
            src={product?.image_url ?? null}
            alt={name}
            className="h-20 w-20 sm:h-24 sm:w-24"
          />

          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-sm font-semibold text-slate-900 sm:text-base">
              {name}
            </h3>

            {category && (
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-indigo-500">
                {category}
              </p>
            )}

            <p className="mt-2 text-sm font-semibold text-slate-900">
              {formatINR(unitPrice)}
            </p>
            <p className="text-xs text-slate-500">Quantity: {quantity}</p>

            {!productAvailable && (
              <p className="mt-2 text-xs text-slate-400">
                This product is no longer available in the catalogue.
              </p>
            )}
          </div>
        </div>

        <div className="lg:pt-1">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Order Status
          </p>
          <StatusTracker status={status} />
        </div>
      </div>

      {/* ---------- actions ---------- */}
      <div className="flex flex-col gap-2 border-t border-slate-100 px-4 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:px-6">
        <button
          type="button"
          onClick={() => onViewDetails(order)}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:w-auto"
        >
          <Eye className="h-4 w-4" />
          View Details
        </button>

        <button
          type="button"
          onClick={() => onTrackOrder(order)}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 sm:w-auto"
        >
          <Truck className="h-4 w-4" />
          Track Order
        </button>

        <button
          type="button"
          onClick={() => onBuyAgain(order)}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 sm:w-auto"
        >
          <ShoppingCart className="h-4 w-4" />
          Buy Again
        </button>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/*  LOADING / EMPTY STATES                                             */
/* ------------------------------------------------------------------ */

function LoadingSkeleton() {
  return (
    <div className="mt-6 space-y-4 sm:space-y-5">
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="flex flex-wrap items-center gap-8 border-b border-slate-100 bg-slate-50/70 px-4 py-4 sm:px-6">
            <div className="space-y-2">
              <div className="h-3 w-20 rounded bg-slate-200" />
              <div className="h-4 w-24 rounded bg-slate-200" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-16 rounded bg-slate-200" />
              <div className="h-4 w-24 rounded bg-slate-200" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-12 rounded bg-slate-200" />
              <div className="h-4 w-16 rounded bg-slate-200" />
            </div>
            <div className="ml-auto h-6 w-20 rounded-full bg-slate-200" />
          </div>

          <div className="grid gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="flex gap-4">
              <div className="h-20 w-20 rounded-xl bg-slate-200 sm:h-24 sm:w-24" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 w-3/4 rounded bg-slate-200" />
                <div className="h-3 w-1/3 rounded bg-slate-200" />
                <div className="h-4 w-1/4 rounded bg-slate-200" />
                <div className="h-3 w-1/5 rounded bg-slate-200" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="h-3 w-24 rounded bg-slate-200" />
              <div className="h-9 w-full rounded-full bg-slate-200" />
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-slate-100 px-4 py-4 sm:flex-row sm:px-6">
            <div className="h-10 w-full rounded-xl bg-slate-200 sm:w-32" />
            <div className="h-10 w-full rounded-xl bg-slate-200 sm:w-32" />
            <div className="h-10 w-full rounded-xl bg-slate-200 sm:w-28" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyOrders({ onExplore }: { onExplore: () => void }) {
  return (
    <div className="mt-10 flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50">
        <Package className="h-10 w-10 text-indigo-500" />
      </div>
      <h2 className="mt-5 text-xl font-bold text-slate-900">No orders yet</h2>
      <p className="mt-2 max-w-sm text-sm text-slate-500">
        You haven&apos;t purchased anything from InfluenceX yet. Discover
        sealed, unused PR products from your favourite creators.
      </p>
      <button
        type="button"
        onClick={onExplore}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
      >
        <ShoppingBag className="h-4 w-4" />
        Explore Products
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN PAGE                                                          */
/* ------------------------------------------------------------------ */

export default function OrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");

  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const [trackOrder, setTrackOrder] = useState<Order | null>(null);

  /* ----------------------------- data ----------------------------- */

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      if (!session?.user) {
        setIsLoggedIn(false);
        setOrders([]);
        return;
      }

      setIsLoggedIn(true);

      const { data, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (ordersError) throw ordersError;

      const orderRows = (data ?? []) as OrderRow[];

      // Collect unique product ids (no N+1 requests)
      const productIds = Array.from(
        new Set(
          orderRows
            .map((order) => order.product_id)
            .filter((id): id is string => Boolean(id))
        )
      );

      const productMap = new Map<string, ProductRow>();

      if (productIds.length > 0) {
        const { data: products, error: productsError } = await supabase
          .from("products")
          .select("id, name, image_url, category, price")
          .in("id", productIds);

        if (productsError) {
          // Non fatal: orders should still render without product images
          console.warn(
            "Could not load product details for orders:",
            productsError.message
          );
        } else {
          ((products ?? []) as ProductRow[]).forEach((product) =>
            productMap.set(product.id, product)
          );
        }
      }

      setOrders(
        orderRows.map((order) => ({
          ...order,
          product: order.product_id
            ? productMap.get(order.product_id) ?? null
            : null,
        }))
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong while fetching your orders.";
      setError(message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  /* --------------------------- filtering -------------------------- */

  const counts = useMemo<Record<StatusFilter, number>>(() => {
    const result: Record<StatusFilter, number> = {
      all: orders.length,
      pending: 0,
      confirmed: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };
    for (const order of orders) {
      result[normalizeStatus(order.status)] += 1;
    }
    return result;
  }, [orders]);

  const visibleOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = orders.filter((order) => {
      const status = normalizeStatus(order.status);

      if (statusFilter !== "all" && status !== statusFilter) return false;

      if (dateFilter !== "all") {
        const created = new Date(order.created_at).getTime();
        if (!Number.isNaN(created)) {
          const days =
            dateFilter === "30d" ? 30 : dateFilter === "3m" ? 90 : 365;
          const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
          if (created < cutoff) return false;
        }
      }

      if (!query) return true;

      const haystack = [
        order.product_name,
        order.product?.name,
        order.product?.category,
        order.id,
        shortOrderId(order.id),
        status,
        STATUS_META[status].label,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });

    const sorted = [...filtered];

    sorted.sort((a, b) => {
      switch (sort) {
        case "oldest":
          return (
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()
          );
        case "price-desc":
          return orderAmount(b) - orderAmount(a);
        case "price-asc":
          return orderAmount(a) - orderAmount(b);
        case "newest":
        default:
          return (
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
          );
      }
    });

    return sorted;
  }, [orders, statusFilter, dateFilter, search, sort]);

  /* ---------------------------- actions --------------------------- */

  const clearFilters = useCallback(() => {
    setStatusFilter("all");
    setDateFilter("all");
    setSearch("");
    setSort("newest");
  }, []);

  const handleBuyAgain = useCallback(
    (order: Order) => {
      if (order.product_id && order.product) {
        router.push(`/products/${order.product_id}`);
      } else {
        router.push("/products");
      }
    },
    [router]
  );

  const hasOrders = orders.length > 0;

  /* ----------------------------- render --------------------------- */

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ------------------------- header ------------------------- */}
        <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
                <ShoppingBag className="h-5 w-5" />
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Your Orders
              </h1>
            </div>
            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Track, manage, and view all your InfluenceX purchases.
            </p>
          </div>

          {isLoggedIn && !loading && !error && hasOrders && (
            <button
              type="button"
              onClick={() => void loadOrders()}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 sm:w-auto"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          )}
        </header>

        {/* ------------------------ controls ------------------------ */}
        {!loading && !error && isLoggedIn && hasOrders && (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-3 lg:flex-row">
              {/* search */}
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search your orders..."
                  aria-label="Search your orders"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-9 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                {/* sort */}
                <select
                  value={sort}
                  onChange={(event) =>
                    setSort(event.target.value as SortOption)
                  }
                  aria-label="Sort orders"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 sm:w-48"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="price-asc">Price: Low to High</option>
                </select>

                {/* date filter */}
                <select
                  value={dateFilter}
                  onChange={(event) =>
                    setDateFilter(event.target.value as DateFilter)
                  }
                  aria-label="Filter orders by date"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 sm:w-44"
                >
                  <option value="all">All time</option>
                  <option value="30d">Last 30 days</option>
                  <option value="3m">Last 3 months</option>
                  <option value="1y">Last year</option>
                </select>
              </div>
            </div>

            {/* status tabs */}
            <div className="mt-4 flex flex-wrap gap-2">
              {STATUS_TABS.map((tab) => {
                const active = statusFilter === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setStatusFilter(tab.key)}
                    className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition sm:text-sm ${
                      active
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:text-indigo-600"
                    }`}
                  >
                    {tab.label}
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                        active
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {counts[tab.key]}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* ------------------------- loading ------------------------ */}
        {loading && <LoadingSkeleton />}

        {/* -------------------------- error ------------------------- */}
        {!loading && error && (
          <div className="mt-8 rounded-2xl border border-red-100 bg-white px-6 py-12 text-center shadow-sm">
            <AlertCircle className="mx-auto h-10 w-10 text-red-500" />
            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              Unable to load your orders
            </h2>
            <p className="mx-auto mt-2 max-w-md break-words text-sm text-slate-500">
              {error}
            </p>
            <button
              type="button"
              onClick={() => void loadOrders()}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          </div>
        )}

        {/* ----------------------- logged out ----------------------- */}
        {!loading && !error && !isLoggedIn && (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50">
              <LogIn className="h-8 w-8 text-indigo-600" />
            </div>
            <h2 className="mt-5 text-lg font-semibold text-slate-900">
              Please log in to view your orders
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
              Sign in to your InfluenceX account to see your order history and
              track your deliveries.
            </p>
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              <LogIn className="h-4 w-4" />
              Login
            </button>
          </div>
        )}

        {/* ------------------------ empty state --------------------- */}
        {!loading && !error && isLoggedIn && !hasOrders && (
          <EmptyOrders onExplore={() => router.push("/products")} />
        )}

        {/* --------------------- no filter results ------------------ */}
        {!loading &&
          !error &&
          isLoggedIn &&
          hasOrders &&
          visibleOrders.length === 0 && (
            <div className="mt-8 rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
              <Search className="mx-auto h-8 w-8 text-slate-300" />
              <h2 className="mt-4 text-lg font-semibold text-slate-900">
                No matching orders
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Try a different search term, status, or date range.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <RotateCcw className="h-4 w-4" />
                Clear filters
              </button>
            </div>
          )}

        {/* ------------------------ orders list --------------------- */}
        {!loading &&
          !error &&
          isLoggedIn &&
          visibleOrders.length > 0 && (
            <section className="mt-6 space-y-4 sm:space-y-5">
              <p className="text-xs font-medium text-slate-500">
                Showing {visibleOrders.length} of {orders.length}{" "}
                {orders.length === 1 ? "order" : "orders"}
              </p>

              {visibleOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onViewDetails={setDetailOrder}
                  onTrackOrder={setTrackOrder}
                  onBuyAgain={handleBuyAgain}
                />
              ))}
            </section>
          )}
      </div>

      {/* ---------------------- details modal --------------------- */}
      {detailOrder && (
        <Modal
          open
          onClose={() => setDetailOrder(null)}
          title="Order Details"
          maxWidth="max-w-2xl"
        >
          {(() => {
            const status = normalizeStatus(detailOrder.status);
            const meta = STATUS_META[status];
            const product = detailOrder.product;
            const name =
              detailOrder.product_name || product?.name || "Product";
            const unitPrice =
              detailOrder.price ?? product?.price ?? 0;
            const quantity = detailOrder.quantity ?? 1;
            const total = orderAmount(detailOrder);

            return (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <DetailItem
                    label="Order ID"
                    value={shortOrderId(detailOrder.id)}
                  />
                  <DetailItem
                    label="Order Date"
                    value={formatDate(detailOrder.created_at)}
                  />
                  <DetailItem
                    label="Status"
                    value={meta.label}
                    valueClassName={meta.text}
                  />
                  <DetailItem label="Total" value={formatINR(total)} />
                </div>

                {/* product */}
                <div className="flex gap-4 rounded-2xl border border-slate-200 p-4">
                  <ProductThumb
                    src={product?.image_url ?? null}
                    alt={name}
                    className="h-20 w-20 sm:h-24 sm:w-24"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-semibold text-slate-900 sm:text-base">
                      {name}
                    </h4>
                    {product?.category && (
                      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-indigo-500">
                        {product.category}
                      </p>
                    )}
                    <p className="mt-2 text-sm text-slate-500">
                      Unit price:{" "}
                      <span className="font-semibold text-slate-800">
                        {formatINR(unitPrice)}
                      </span>
                    </p>
                    <p className="text-sm text-slate-500">
                      Quantity:{" "}
                      <span className="font-semibold text-slate-800">
                        {quantity}
                      </span>
                    </p>
                  </div>
                </div>

                {/* payment summary */}
                <div className="rounded-2xl border border-slate-200 p-4">
                  <h4 className="text-sm font-semibold text-slate-900">
                    Payment Summary
                  </h4>
                  <dl className="mt-3 space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <dt className="text-slate-500">Item price</dt>
                      <dd className="font-medium text-slate-800">
                        {formatINR(unitPrice)}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-slate-500">Quantity</dt>
                      <dd className="font-medium text-slate-800">
                        {quantity}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-100 pt-2">
                      <dt className="font-semibold text-slate-900">
                        Total amount
                      </dt>
                      <dd className="font-bold text-slate-900">
                        {formatINR(total)}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* tracker */}
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Status Timeline
                  </p>
                  <StatusTracker status={status} />
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => handleBuyAgain(detailOrder)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Buy Again
                  </button>
                  <button
                    type="button"
                    onClick={() => setDetailOrder(null)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            );
          })()}
        </Modal>
      )}

      {/* ---------------------- tracking modal -------------------- */}
      {trackOrder && (
        <Modal
          open
          onClose={() => setTrackOrder(null)}
          title="Track Order"
          maxWidth="max-w-lg"
        >
          {(() => {
            const status = normalizeStatus(trackOrder.status);
            const meta = STATUS_META[status];

            return (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-900">
                    Order {shortOrderId(trackOrder.id)}
                  </p>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${meta.badge}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                    {meta.label}
                  </span>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <StatusTracker status={status} />
                </div>

                <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
                  {TRACK_MESSAGES[status]}
                </p>

                <p className="text-xs text-slate-400">
                  Order placed on {formatDate(trackOrder.created_at)}
                </p>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setTrackOrder(null)}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            );
          })()}
        </Modal>
      )}
    </main>
  );
}