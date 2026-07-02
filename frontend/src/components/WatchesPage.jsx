import React, { useEffect, useMemo, useState } from "react";
import { watchPageStyles } from "../assets/dummyStyles";
import {
  WATCHES as DUMMY_WATCHES,
  FILTERS as RAW_FILTERS,
} from "../assets/dummywdata";
import { useCart } from "../CartContext";
import { Grid, Minus, Plus, ShoppingCart, User, Users } from "lucide-react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const ICON_MAP = { Grid, User, Users };

const FILTERS = RAW_FILTERS?.length
  ? RAW_FILTERS.map((f) => ({
      ...f,
      icon: ICON_MAP[f.iconName] ?? Grid,
    }))
  : [
      { key: "all", label: "All", icon: Grid },
      { key: "men", label: "Men", icon: User },
      { key: "women", label: "Women", icon: Users },
    ];

const WatchesPage = () => {
  const [filter, setFilter] = useState("all");
  const { cart, addItem, increment, decrement, removeItem } = useCart();

  const [watches, setWatches] = useState([]);
  const [loading, setLoading] = useState(true);
  

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

  const mapServerToUI = (item) => {
    let img = item.image ?? item.img ?? "";

    if (typeof img === "string" && img.startsWith("/")) {
      img = `${API_BASE}${img}`;
    }

    // ✅ Strong gender handling
    const rawGender = (item.gender ?? item.category ?? "")
      .toString()
      .trim()
      .toLowerCase();

    const gender = rawGender.includes("men")
      ? "men"
      : rawGender.includes("women")
      ? "women"
      : "unisex";

    return {
      id: item._id ?? item.id ?? Math.random().toString(),
      name: item.name ?? "No Name",

      // ✅ FIX desc → description
      description: item.description ?? item.desc ?? "",

      // ✅ FIX price string → number
      price:
        typeof item.price === "string"
          ? parseFloat(item.price.replace(/[^\d.]/g, ""))
          : item.price ?? 0,

      category: item.category ?? "",
      brand: item.brandName ?? "",
      img,
      gender,
      raw: item,
    };
  };

  useEffect(() => {
    let mounted = true;

    const fetchWatches = async () => {
      setLoading(true);

      try {
        const resp = await axios.get(
          `${API_BASE}/api/watches?limit=10000`
        );

        const data = resp.data;

        const items = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.items)
          ? data.items
          : Array.isArray(data?.watches)
          ? data.watches
          : [];

        console.log("API DATA:", items);

        if (!items || items.length === 0) {
          if (mounted) {
            console.log("Using Dummy Data");
            setWatches(DUMMY_WATCHES.map(mapServerToUI));
            toast.info("Using local dummy watches.");
          }
        } else {
          if (mounted) {
            setWatches(items.map(mapServerToUI));
          }
        }
      } catch (err) {
        console.error("API ERROR:", err);

        if (mounted) {
          console.log("Fallback Dummy Data");
          setWatches(DUMMY_WATCHES.map(mapServerToUI));
          toast.warn("Server error — using dummy watches.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchWatches();

    return () => {
      mounted = false;
    };
  }, []);

  // ✅ FIXED CART QTY
  const getQty = (id) => {
    const items = Array.isArray(cart) ? cart : cart?.items ?? [];

    const match = items.find((c) =>
      [c.productId, c.id, c._id].some(
        (field) => String(field ?? "") === String(id)
      )
    );

    return match ? Number(match.qty ?? match.quantity ?? 0) : 0;
  };

  // ✅ FIXED FILTER
  const filtered = useMemo(() => {
  if (filter === "all") return watches;

  return watches.filter((w) => {
    return String(w.gender)
      .toLowerCase()
      .trim()
      .includes(filter);
  });
}, [filter, watches]);

  return (
    <div className={watchPageStyles.container}>
      <ToastContainer />

      <div className={watchPageStyles.headerContainer}>
        <div>
          <h1 className={watchPageStyles.headerTitle}>
            Timepieces{" "}
            <span className={watchPageStyles.titleAccent}>
              Curated
            </span>
          </h1>

          <p className={watchPageStyles.headerDescription}>
            Clean UI - Filter your watches easily.
          </p>
        </div>

        {/* FILTER BUTTONS */}
        <div className={watchPageStyles.filterContainer}>
          {FILTERS.map((f) => {
            const Icon = f.icon;
            const active = filter === f.key;

            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`${watchPageStyles.filterButtonBase} ${
                  active
                    ? watchPageStyles.filterButtonActive
                    : watchPageStyles.filterButtonInactive
                }`}
              >
                <Icon className={watchPageStyles.filterIcon} />
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* LOADING / EMPTY */}
      {loading ? (
        <div className={watchPageStyles.loadingText}>
          Loading watches...
        </div>
      ) : filtered.length === 0 ? (
        <div className={watchPageStyles.noWatchesText}>
          No Watches found.
        </div>
      ) : (
        <div className={watchPageStyles.grid}>
          {filtered.map((w) => {
            const sid = String(w.id);
            const qty = getQty(sid);

            return (
              <div key={sid} className={watchPageStyles.card}>
                <div className={watchPageStyles.imageContainer}>
                  <img
                    src={w.img}
                    alt={w.name}
                    className={watchPageStyles.image}
                  />

                  <div className={watchPageStyles.cartControlsContainer}>
                    {qty > 0 ? (
                      <div className={watchPageStyles.cartQuantityControls}>
                        <button
                          onClick={() =>
                            qty > 1
                              ? decrement(sid)
                              : removeItem(sid)
                          }
                          className={watchPageStyles.quantityButton}
                        >
                          <Minus />
                        </button>

                        <div className={watchPageStyles.cartQuantity}>
                          {qty}
                        </div>

                        <button
                          onClick={() => increment(sid)}
                          className={watchPageStyles.cartButton}
                        >
                          <Plus />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() =>
                          addItem({
                            id: sid,
                            name: w.name,
                            price: w.price,
                            img: w.img,
                          })
                        }
                        className={watchPageStyles.addToCartButton}
                      >
                        <ShoppingCart />
                        Add
                      </button>
                    )}
                  </div>
                </div>

                <div className={watchPageStyles.productInfo}>
                  <h3 className={watchPageStyles.productName}>
                    {w.name}
                  </h3>

                  <p className={watchPageStyles.productDescription}>
                    {w.description}
                  </p>

                  <div className={watchPageStyles.productPrice}>
                    ₨{Number(w.price).toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WatchesPage;