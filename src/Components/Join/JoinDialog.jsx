import DownloadDialog from "../ProcessSection/DownloadDialog.jsx";
import { JOIN_DIALOG, JOIN_LINKS } from "./joinLinks.js";

/**
 * "Join Us" picker.
 *
 * Deliberately the same component as the wallet's platform picker rather than a
 * new dialog that looks like it. The brief was that this should behave exactly
 * as that one does, and the surest way to keep two things identical is for them
 * to be the same thing: one panel, one animation, one focus and scroll-lock
 * behaviour. It only takes a different set of badges — see BADGES in
 * DownloadDialog.jsx, where `x` and `telegram` sit alongside `chrome`, `play`
 * and `appstore`.
 */
export default function JoinDialog({ open, onClose }) {
  return (
    <DownloadDialog
      open={open}
      title={JOIN_DIALOG.title}
      subtitle={JOIN_DIALOG.subtitle}
      downloads={JOIN_LINKS}
      onClose={onClose}
    />
  );
}
