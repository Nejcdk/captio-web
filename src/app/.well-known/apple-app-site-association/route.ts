// Universal links: invite links (captioai.app/f/<code>) open the Captio AI app
// when it's installed, straight into joining the folder; without the app they
// show the invite page. Team BCSP2C9Y8X, bundle com.captio.nejcdovzan.
export const dynamic = "force-static";

export function GET() {
  return Response.json({
    applinks: {
      details: [
        {
          appIDs: ["BCSP2C9Y8X.com.captio.nejcdovzan"],
          components: [{ "/": "/f/*", comment: "Shared folder invites" }],
        },
      ],
    },
  });
}
