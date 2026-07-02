import React, { useEffect, useState } from "react";
import watchesData from "../assets/Categoriesdata";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../CartContext";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import axios from "axios";
import { brandPageStyles } from "../assets/dummyStyles";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";


const BrandPage = () => {
  const { brandName } = useParams();
  const navigate = useNavigate();
  const { addItem, cart, increment, decrement } = useCart();
  const [brandWatches, setBrandWatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // fetch the brand watches from local data
  useEffect(() => {
    if (!brandName) {
      setBrandWatches([]);
      return;
    }

    let cancelled = false;
    (() => {
      setLoading(true);
      setError(null);
      try {
        // Get the watches for this brand from the local data
        const brandWatchesData = watchesData[brandName];
        if (!brandWatchesData) {
          setBrandWatches([]);
          setError("Brand not found");
          return;
        }
        const mapped = brandWatchesData.map((it) => {
          const id = it.id ?? "";
          const rawPrice =
            typeof it.price === "number"
              ? it.price
              : Number(String(it.price ?? "").replace(/[^0-9.-]+/g, "")) || 0;
          let img = it.image ?? "";
          return {
            id: String(id),
            image: img || null,
            name: it.name ?? "",
            desc: it.desc ?? it.description ?? "",
            priceDisplay: `₨${Number(rawPrice).toFixed(2)}`,
            price: rawPrice,
          };
        });
        if (!cancelled) setBrandWatches(mapped);
      } catch (err) {
        console.error("Failed to fetch brand watches:", err);
        if (!cancelled) setError("Failed to load watches. Try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [brandName]);

  const findInCart = (id) =>
    cart.find(
      (p) => String(p.id) === String(id) || String(p.productId) === String(id)
    );

  if (loading) {
    return (
      <div className={brandPageStyles.loadingContainer}>
        <div className="text-center">
          <div className={brandPageStyles.loadingText}>
            Loading watches...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={brandPageStyles.container}>
        <div className={brandPageStyles.notFoundCard}>
          <h2 className={brandPageStyles.notFoundTitle}>Error</h2>
          <p className={brandPageStyles.notFoundText}>{error}</p>
          <button
            onClick={() => navigate(-1)}
            className={brandPageStyles.goBackButton}
          >
            <ArrowLeft className={brandPageStyles.goBack} /> Go back
          </button>
        </div>
      </div>
    );
  }

  if (!brandWatches.length) {
    return (
      <div className={brandPageStyles.notFoundContainer}>
        <div className={brandPageStyles.notFoundCard}>
          <h2 className={brandPageStyles.notFoundTitle}>
            No watches found
          </h2>
          <p className={brandPageStyles.notFoundText}>
            This brand has no watches listed in our collection yet.
          </p>
          <button
            onClick={() => navigate(-1)}
            className={brandPageStyles.goBackButton}
          >
            <ArrowLeft className={brandPageStyles.goBackIcon} /> Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    // FIX 1: overflow-x-hidden added to remove horizontal scrollbar
    <div className="min-h-screen bg-gray-100 py-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4">

        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-700 hover:text-black"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back</span>
          </button>
        </div>

        {/* Center Title */}
        <div className="flex justify-center mb-10">
          <h1 className="text-3xl md:text-4xl font-semibold px-10 py-3 
                         bg-white rounded-full shadow-md border">
            {brandName} Collections
          </h1>
        </div>

        {/* Watches Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {brandWatches.map((watch) => {
            const inCart = findInCart(watch.id);

             const displayedQty = inCart?.quantity ?? 0;
            const targetId = inCart?.id ?? inCart?._id ?? inCart?.productId ?? watch.id;

            return (
              <div
                key={watch.id}
                className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition duration-300"
              >
                {/* FIX 2 & 3: Fixed image/placeholder height to h-44 for consistent card sizing */}
                {watch.image ? (
                  <img
                    src={watch.image}
                    alt={watch.name}
                    className="w-full h-44 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-44 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}

                {/* Details */}
                <div className="mt-4">
                  <h2 className="font-semibold text-lg">
                    {watch.name}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {watch.desc}
                  </p>

                  {/* Price + Controls */}
                  <div className="flex justify-between items-center mt-4">
                    <p className={brandPageStyles.price}>
                      {watch.priceDisplay ?? `${watch.price.toFixed(2)}`}
                    </p>

                    {inCart ? (
                      <div className="flex items-center gap-3 bg-gray-100 px-3 py-1 rounded-lg">
                        <button
                          onClick={() => decrement(watch.id)}
                          className="hover:text-red-500"
                        >
                          <Minus className={brandPageStyles.quantityIcon} />
                        </button>

                        <div className={brandPageStyles.quantityCount}>
                          {displayedQty}
                        </div>

                        <button
                          onClick={() => increment(targetId)}
                          className="hover:text-green-600"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() =>
                          addItem({
                            id: watch.id,
                            name: watch.name,
                            price: watch.price,
                            img: watch.image,
                            qty: 1,
                          })
                        }
                        className="bg-gray-200 px-4 py-1 rounded-lg hover:bg-gray-300"
                      >
                        Add
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default BrandPage;