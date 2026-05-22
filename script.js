const mapConfig = {
  west: 139.56,
  east: 139.92,
  north: 35.82,
  south: 35.52,

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

async function loadPlaces() {
  try {
    const response = await fetch("places.json");
    const places = await response.json();

    const pinLayer = document.getElementById("pinLayer");
    const placeList = document.getElementById("placeList");

    places.forEach(place => {
  const { x, y } = latLngToPercent(place.lat, place.lng);

  const linkUrl = place.url;

  // ピンとラベルをまとめる箱
  const markerWrap = document.createElement("div");
  markerWrap.className = "marker-wrap";
  markerWrap.style.left = `${x}%`;
  markerWrap.style.top = `${y}%`;

  // ピン
  const pin = document.createElement("div");
  pin.className = "pin";
  pin.textContent = "📍";
  pin.title = place.name;

  pin.addEventListener("click", () => {
    window.open(linkUrl, "_blank");
  });

  // 店名ラベル
  const label = document.createElement("div");
  label.className = "pin-label";
  label.textContent = place.name;

  markerWrap.appendChild(pin);
  markerWrap.appendChild(label);
  pinLayer.appendChild(markerWrap);

  // 一覧
  const li = document.createElement("li");
  const a = document.createElement("a");
  a.textContent = place.name;
  a.href = linkUrl;
  a.target = "_blank";
  a.rel = "noopener noreferrer";

  li.appendChild(a);
  placeList.appendChild(li);
});
  } catch (error) {
    console.error("places.json の読み込みに失敗しました", error);
  }
}

loadPlaces();