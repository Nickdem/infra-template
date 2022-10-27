import fetch from "node-fetch";
import github from "@actions/github";

async function updateTicket() {
  try {
    const commitsForDescription = await getCommits();
    const summary = `Релиз ${
      process.env.RELEASE
    } от ${new Date().toLocaleDateString()}`;
    const description = `Ответственный за релиз: ${process.env.ACTOR}
        ..........................................................................................
        Коммиты, попавшие в релиз:
        ${commitsForDescription}
      `;

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
      throw Error("Ошибка ", res.statusText);
    }
  } catch (e) {
    console.log(e);
  }
}

async function getCommits() {
  try {
    // const res = await fetch(github.repository.compare_url);
    const releaseNum = process.env.RELEASE.split(".").pop();
    const url =
      +releaseNum > 1
        ? `https://api.github.com/repos/Nickdem/infra-template/compare/rc-0.0.${
            +releaseNum - 1
          }...${process.env.RELEASE}`
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
