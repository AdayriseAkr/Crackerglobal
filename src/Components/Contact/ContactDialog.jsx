import DownloadDialog from "../ProcessSection/DownloadDialog.jsx";
import { X_URL, TELEGRAM_URL } from "../Join/joinLinks.js";
import { COMPANY, CONTACT_EMAILS, CONTACT_DIALOG } from "./contactDetails.js";
import "./ContactDialog.css";

/**
 * Contact card.
 *
 * Same panel as the wallet's platform picker and the Join Us dialog — it takes
 * children now instead of a badge list, so this gets that overlay, entrance,
 * focus handling and scroll lock for free rather than a second implementation
 * of them that slowly drifts.
 */
export default function ContactDialog({ open, onClose }) {
  return (
    <DownloadDialog
      open={open}
      title={CONTACT_DIALOG.title}
      subtitle={CONTACT_DIALOG.subtitle}
      onClose={onClose}
    >
      <div className="contactCard">
        {/* The registered entity, first. For a crypto product the useful thing
            a contact page can say is that there is a company behind this, and
            where it is — it carries more than another email row does. */}
        <address className="contactCard__address">
          <span className="contactCard__label">Registered office</span>
          <span className="contactCard__company">{COMPANY.name}</span>
          {COMPANY.lines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </address>

        <ul className="contactCard__emails">
          {CONTACT_EMAILS.map((entry) => (
            <li key={entry.id}>
              <a className="contactCard__email" href={`mailto:${entry.address}`}>
                <span className="contactCard__emailHead">
                  <span className="contactCard__label">{entry.label}</span>
                  <span className="contactCard__address-line">{entry.address}</span>
                </span>
                <span className="contactCard__detail">{entry.detail}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="contactCard__social">
          <span className="contactCard__label">Or find us on</span>
          <div className="contactCard__socialRow">
            <a href={X_URL} target="_blank" rel="noopener noreferrer">
              X
            </a>
            <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
              Telegram
            </a>
          </div>
        </div>
      </div>
    </DownloadDialog>
  );
}
