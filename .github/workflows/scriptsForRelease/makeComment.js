import fetch from "node-fetch";

async function makeComment() {
  try {
    const { RELEASE, TICKET, ORG_ID, AUTH } = process.env;

    const headers = {
      Authorization: `OAuth ${AUTH}`,
      "X-Org-ID": ORG_ID,
      "Content-Type": "application/json",
    };

    const res = await fetch(
      `https://api.tracker.yandex.net/v2/issues/${TICKET}/comments`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          text: `Собрали образ в тегом ${RELEASE}`,
        }),
      }
    );

    if (!res.ok) {
      throw Error("Ошибка ", res.statusText);
    }
  } catch (e) {
    console.log(e);
  }
}

makeComment().then(() => console.log("Sent"));
