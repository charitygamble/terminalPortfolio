export async function onRequestPost(context) {
  const formData = await context.request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");

  // MailChannels logic
  const res = await fetch("https://api.mailchannels.net/tx/v1/send", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: "youremail@yourdomain.com" }] }],
      from: { email: "charity@charitygamble.dev", name: "Portfolio" },
      subject: `New Message from ${name}`,
      content: [{ type: "text/plain", value: message }]
    })
  });

  return Response.redirect("https://charitygamble.dev/success", 303);
}