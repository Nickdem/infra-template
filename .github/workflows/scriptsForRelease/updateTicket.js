import fetch from "node-fetch";

async function updateTicket() {
  try {
    const summary = `Релиз ${process.env.RELEASE} от ${new Date().toLocaleDateString()}`;
    const description = `Ответственный за релиз: ${process.env.ACTOR}
        ..............................
        Коммиты, попавшие в релиз:
        НУЖНО ДО НИХ ДОСТУЧАТЬСЯ!1!!`;

    const res = await fetch(
      `https://api.tracker.yandex.net/v2/issues/${process.env.TICKET}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `OAuth ${process.env.AUTH}`,
          "X-Org-ID": process.env.ORG_ID,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ summary, description }),
      }
    );

    if (!res.ok) {
      throw Error('Ошибка ', res.statusText);
    }
  } catch (e) {
    console.log(e);
  }
}

updateTicket().then(() => console.log('Updated'));

