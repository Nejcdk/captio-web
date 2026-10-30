// Universal links: invite links (captioai.app/f/<code>, a shared folder, and
// captioai.app/i/<code>, someone's personal link) open the Captio AI app when
// it's installed; without the app they show the invite page. Team BCSP2C9Y8X, bundle com.captio.nejcdovzan.
export const dynamic = "force-static";

export function GET() {
  return Response.json({
    applinks: {
      details: [
        {
          appIDs: ["BCSP2C9Y8X.com.captio.nejcdovzan"],
          components: [
            { "/": "/f/*", comment: "Shared folder invites" },
            { "/": "/i/*", comment: "Personal invite links" },
          ],
        },
      ],
    },
  });
}
