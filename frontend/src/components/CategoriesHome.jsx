import React, { useState } from 'react'
import { categoriesHomeStyles } from '../assets/dummyStyles'
import brands from '../assets/CategoriesHomedata'
import { Link } from 'react-router-dom'

const CategoriesHome = () => {
  const [hoverBrand, setHoverBrand] = useState(null)
  return (
    <section className={categoriesHomeStyles.section}>
      <div className={categoriesHomeStyles.container}>
        <header className={categoriesHomeStyles.header} style={categoriesHomeStyles.playfairFont}>
          <h1 className={categoriesHomeStyles.h1} style={categoriesHomeStyles.h1FontSize}>
            <span className={categoriesHomeStyles.h1SpanRegular}>
              Premium Watch
            </span>
            <span className={categoriesHomeStyles.h1SpanAccent}>
              Brands
            </span>
          </h1>
          <div className={categoriesHomeStyles.underline}></div>

          <p className={categoriesHomeStyles.subtext}>
            Discover the world's most prestigius watchmakers - curated picks
            for every occasion.
          </p>
        </header>

        {/* card section GRID */}
        <div className={categoriesHomeStyles.grid} style={categoriesHomeStyles.playfairFont}>
        {brands.map((brand) =>(
          <Link key={brand.id} to={brand.link}
          className={categoriesHomeStyles.cardLink}
          onMouseEnter={() =>setHoverBrand(brand.id)}
          onMouseLeave={() => setHoverBrand(null)}
          >
            <div className={categoriesHomeStyles.cardWrapper}>
              <div className={categoriesHomeStyles.imageContainer}>
                  <img
                   src={brand.image}
                    alt={brand.name}
                   className={categoriesHomeStyles.image} 
                   loading="lazy" />
              </div>

              <div className={categoriesHomeStyles.cardContent}>
                <h3 className={`${categoriesHomeStyles.cardTitleBase}
                ${hoverBrand === brand.id 
                  ? categoriesHomeStyles.cardTitleHover
                  : categoriesHomeStyles.cardTitleNormal}
                `}>
                  {brand.name}
                  {console.log("Brand", brand)}

                </h3>
                {brand.tagline ? (
                  <p className={categoriesHomeStyles.cardTagline}>
                    {brand.tagline}
                  </p>
                ) : null }
              </div>
              <span className={categoriesHomeStyles.focusRing} />
            </div>
          </Link>
        ))}
        </div>
      </div>
      <style>{categoriesHomeStyles.styleString}</style>
    </section>
  )
}

export default CategoriesHome