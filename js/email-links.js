document.addEventListener("click", (event) => {
  const link = event.target.closest(".social.email");

  if (!link) {
    return;
  }

  event.preventDefault();

  const user = link.dataset.emailUser;
  const domain = link.dataset.emailDomain;
  const tld = link.dataset.emailTld;

  if (!user || !domain || !tld) {
    return;
  }

  const email = `${user}@${domain}.${tld}`;
  const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;
  window.open(url, "_blank", "noopener");
});
