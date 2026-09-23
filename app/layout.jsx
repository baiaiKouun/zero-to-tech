import "../css/reset.css";
import "../css/variables.css";
import "../css/layout.css";
import "../css/hero.css";
import "../css/nav.css";
import "../css/cards.css";
import "../css/lab.css";
import "../css/responsive.css";

export const metadata = {
  title: "zero to tech",
  description: "个人主页 + 文字实验室",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="app-shell">
          <div className="page-shell">
            <main className="page-content">{children}</main>
            <footer className="site-footer">
              <div className="filing-box">
                <a
                  href="https://beian.miit.gov.cn/"
                  rel="noreferrer"
                  target="_blank"
                >
                  蜀ICP备2026055874号
                </a>
                <a
                  className="police-filing-link"
                  href="https://beian.mps.gov.cn/#/query/webSearch?code=51012202002682"
                  rel="noreferrer"
                  target="_blank"
                >
                  <img src="/bei-an-police.png" alt="" />
                  <span>川公网安备51012202002682号</span>
                </a>
              </div>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
