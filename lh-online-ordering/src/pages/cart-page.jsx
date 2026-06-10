cart.map((item, index) => (
  <div
    key={index}
    style={{
      marginBottom: "20px",
      padding: "15px",
      border: "1px solid #ddd",
    }}
  >
    <img
      src={
        item._embedded?.["wp:featuredmedia"]?.[0]
          ?.media_details?.sizes?.large?.source_url
      }
      alt={item.title?.rendered}
      style={{
        width: "150px",
        height: "150px",
        objectFit: "cover",
        marginBottom: "10px"
      }}
    />

    <h3>{item.title?.rendered}</h3>

    <p>
      ₱
      {Number(
        item.acf?.price || 0
      ).toLocaleString("en-PH")}
    </p>
  </div>
))
