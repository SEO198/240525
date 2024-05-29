const calcTime = (timestamp) => {
  const curTime = new Date().getTime();
  const timeDiff = curTime - timestamp;
  const time = new Date(timeDiff);
  const hour = Math.floor(timeDiff / (1000 * 60 * 60));
  const minute = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const second = Math.floor((timeDiff % (1000 * 60)) / 1000);

  if (hour > 0) return `${hour}시간 전`;
  else if (minute > 0) return `${minute}분 전`;
  else if (second > 0) return `${second}초 전`;
  return "방금 전";
};
const renderDate = (data) => {
  const main = document.querySelector("main");
  data.reverse().forEach(async (obj) => {
    const div = document.createElement("div");
    div.className = "item-list";

    const imgDiv = document.createElement("div");
    imgDiv.className = "item-list__img";

    const img = document.createElement("img");
    const res = await fetch(`/images/${obj.id}`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    img.src = url;

    const infoDiv = document.createElement("div");
    infoDiv.className = "item-list__info";

    const titleDiv = document.createElement("div");
    titleDiv.className = "item-list__info-title";
    titleDiv.innerText = obj.title;

    const metaDiv = document.createElement("div");
    metaDiv.className = "item-list__info-meta";
    metaDiv.innerText = obj.place + " · " + calcTime(obj.insertAT);

    const priceDiv = document.createElement("div");
    priceDiv.className = "item-list__info-price";
    priceDiv.innerText = obj.price;

    imgDiv.appendChild(img);
    infoDiv.appendChild(titleDiv);
    infoDiv.appendChild(metaDiv);
    infoDiv.appendChild(priceDiv);
    div.appendChild(imgDiv);
    div.appendChild(infoDiv);
    main.appendChild(div);
  });
};

const fetchList = async () => {
  const accessToken = window.localStorage.getItem("token");
  const res = await fetch("/items", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (res.status == 401) {
    alert("로그인이 필요합니다.");
    window.location.pathname = "login.html";
    return;
  }
  const data = await res.json();
  renderDate(data);
};

fetchList();
