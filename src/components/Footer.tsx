export default function Footer() {
    const year = new Date().getFullYear()
  
    return (
      <footer className="footer">
        <div className="container footer-inner">
  
          <div className="footer-brand">
            <a href="#" className="footer-logo">
              <span className="curly">{`{`}</span>
              <span className="e-logo">E</span>
              <span className="curly">{`}`}</span>
            </a>
            <p className="footer-tagline">
              Building fast, refined web experiences<br />engineered with precision.
            </p>
            <div className="footer-status">
              <span className="footer-status-dot"></span>
              Available for new projects
            </div>
          </div>
  
          <div className="footer-col">
            <h4 className="footer-col-title">Sections</h4>
            <ul className="footer-links">
              <li><a href="#about">About</a></li>
              <li><a href="#work">Selected Work</a></li>
              <li><a href="#skills">Skills</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#beliefs">Beliefs</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
  
          <div className="footer-col">
            <h4 className="footer-col-title">Connect</h4>
            <ul className="footer-links">
              <li>
                <a href="https://github.com/emmanuelonyeka" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/emmanuelymb/" target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="https://x.com/emmmybills?s=21" target="_blank" rel="noopener noreferrer">
                  Twitter / X
                </a>
              </li>
              <li>
                <a href="https://wa.me/2348169269415" target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </li>
              <li>
                <a href="mailto:emmanuel.onyekachi.dev@gmail.com">
                  Email
                </a>
              </li>
            </ul>
          </div>
  
        </div>
  
        <div className="container footer-bottom">
          <p className="footer-copy">
            © {year} Emmanuel Onyekachi. All rights reserved.
          </p>
          <p className="footer-built">
            Designed & built by Emmanuel Onyekachi
          </p>
        </div>
      </footer>
    )
  }