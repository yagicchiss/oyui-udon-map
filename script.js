const mapConfig = {
  // 23区のおおよその範囲
  west: 139.56,
  east: 139.92,
  north: 35.82,
  south: 35.52,

  // 画像上で実際に地図が描かれている範囲（％）
  layout: {
    left: 6,
    right: 95.5,
    top: 3.7,
    bottom: 96
  }
};

function latLngToPercent(lat, lng) {
  const { west, east, north, south, layout } = mapConfig;

  const rawX = (lng - west) / (east - west);
  const rawY = (north - lat) / (north - south);

  const x = layout.left + rawX * (layout.right - layout.left);
  const y = layout.top + rawY * (layout.bottom - layout.top);

  return { x, y };
}

function createGoogleMapsUrl(lat, lng) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

async function loadPlaces() {
  try {
    const response = await fetch("places.json");
    const places = await response.json();

    const pinLayer = document.getElementById("pinLayer");
    const placeList = document.getElementById("placeList");

    places.forEach(place => {
      const { x, y } = latLngToPercent(place.lat, place.lng);

      // ピン
      const pin = document.createElement("div");
      pin.className = "pin";
      pin.textContent = "📍";
      pin.style.left = `${x}%`;
      pin.style.top = `${y}%`;
      pin.title = place.name;

      pin.addEventListener("click", () => {
        window.open(createGoogleMapsUrl(place.lat, place.lng), "_blank");
      });

      // ラベル
      const label = document.createElement("div");
      label.className = "pin-label";
      label.textContent = place.name;
      label.style.left = `${x}%`;
      label.style.top = `${y}%`;

      // 一覧
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.textContent = place.name;
      a.href = createGoogleMapsUrl(place.lat, place.lng);
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      li.appendChild(a);

      pinLayer.appendChild(pin);
      pinLayer.appendChild(label);
      placeList.appendChild(li);
    });
  } catch (error) {
    console.error("places.json の読み込みに失敗しました", error);
  }
}

loadPlaces();