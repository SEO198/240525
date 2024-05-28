const form = document.querySelector("#login-form");

const handleSubmit = async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const sha256Password = sha256(formData.get("password"));
  formData.set("password", sha256Password);

  const div = document.querySelector("#info");

  const res = await fetch("/login", {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
};

form.addEventListener("submit", handleSubmit);
