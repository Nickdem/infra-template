import fetch from "node-fetch";

async function updateTicket() {
  try {
    const { RELEASE, TICKET, ACTOR, ORG_ID, AUTH } = process.env;

    const commitsForDescription = await getCommits(RELEASE);
    const date = new Date().toLocaleDateString();
    const summary = `Релиз ${RELEASE} - ${date}`;
    const description = `Ответственный за релиз: ${ACTOR}
        ..........................................................................................
        Коммиты, попавшие в релиз:
        ${commitsForDescription}
      `;

    const headers = {
      Authorization: `OAuth ${AUTH}`,
      "X-Org-ID": ORG_ID,
      "Content-Type": "application/json",
    };

    const res = await fetch(
      `https://api.tracker.yandex.net/v2/issues/${TICKET}`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify({ summary, description }),
      }
    );

    if (!res.ok) {
      throw Error("Ошибка ", res.statusText);
    }
  } catch (e) {
    console.log(e);
  }
}

async function getCommits(release) {
  try {
    const releaseNum = +release.split(".").pop();

    const url =
      +releaseNum > 1
        ? `https://api.github.com/repos/Nickdem/infra-template/compare/rc-0.0.${
            +releaseNum - 1
          }...${release}`
        : "https://api.github.com/repos/Nickdem/infra-template/commits";

    const res = await fetch(url);

    if (!res.ok) {
      throw Error("Ошибка ", res.statusText);
    }

    const json = await res.json();
    const commits = +releaseNum > 1 ? json.commits : json;
    const result = commits
      .map((c) => {
        return `${c.commit.author.name} - ${c.commit.message}`;
      })
      .join("\n");

    return result;
  } catch (e) {
    console.log(e);
  }
}

updateTicket().then(() => console.log("Updated"));
