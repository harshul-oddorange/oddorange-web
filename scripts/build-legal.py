"""
Generates the legal pages (terms, privacy, refunds, cookies) and the 404 page from one template.
Edit the text below, then run:  python3 scripts/build-legal.py
Anything in TODO(...) renders highlighted so it can't be missed before launch.
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
UPDATED = '14 October 2026'
EMAIL = 'harshul@oddorange.co'
MAIL = f'<a href="mailto:{EMAIL}">{EMAIL}</a>'

MARK = (
    '<svg viewBox="0 0 80 80" aria-hidden="true"><g fill="currentColor"><circle cx="14" cy="14" r="8.5"/>'
    '<circle cx="40" cy="14" r="8.5"/><circle cx="66" cy="14" r="8.5"/><circle cx="14" cy="40" r="8.5"/>'
    '<circle cx="66" cy="40" r="8.5"/><circle cx="14" cy="66" r="8.5"/><circle cx="40" cy="66" r="8.5"/>'
    '<circle cx="66" cy="66" r="8.5"/></g><circle cx="40" cy="40" r="12" fill="#FF6D1F"/></svg>'
)

PAGE = """<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title} — Odd Orange</title>
    <meta name="description" content="{desc}" />
    <meta name="theme-color" content="#FFFFFF" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="stylesheet" href="/src/styles/main.css" />
  </head>
  <body>
    <header class="legal-nav">
      <a class="site-nav__logo" href="/">{mark}<span>odd orange</span></a>
      <a class="btn btn--outline btn--small" href="/">← Back to site</a>
    </header>
    <main class="legal">
      <h1>{title}</h1>
      <p class="label legal__updated">Last updated: {updated}</p>
{body}
    </main>
    <footer class="legal-foot">
      <span>© 2026 Odd Orange · {mail}</span>
      <nav aria-label="Legal">
        <a href="/terms.html">Terms</a><a href="/privacy.html">Privacy</a><a href="/cookies.html">Cookies</a><a href="/refunds.html">Refunds</a>
      </nav>
    </footer>
  </body>
</html>
"""

BUSINESS = f"""
      <div class="legal__box">
        <p><strong>Odd Orange</strong> is a sole proprietorship run by Harshul Joshi.</p>
        <p>Address: 4/262, Goverdhan Vilas, Sector 14, Udaipur, Rajasthan, India</p>
        <p>Email: {MAIL} · Website: oddorange.co</p>
      </div>"""

GRIEVANCE = f"""
      <div class="legal__box">
        <p><strong>Grievance Officer:</strong> Harshul Joshi · {MAIL}</p>
        <p>We acknowledge every complaint within 48 hours and aim to resolve it within one month.</p>
      </div>"""

TERMS = f"""
      <p>These terms apply when you hire Odd Orange ("we", "us") to edit videos or create motion graphics. By approving a quote or paying a deposit, you ("you", the client) agree to them. Please read them with your quote; if anything in your written quote differs, the quote wins for that project.</p>

      <h2 id="who">1. Who we are</h2>{BUSINESS}

      <h2 id="services">2. Services, quotes and prices</h2>
      <p>We offer social media Reels editing and motion-graphics videos (including SaaS explainers and launch videos). Website prices are <strong>starting prices for videos up to 60 seconds</strong>. Reels prices assume you supply the footage.</p>
      <p>Your project's scope, deliverables, price, timeline and number of revisions are confirmed in a written quote (email or message is fine) before we start. Longer videos, complex edits, unusable footage, filming, extensive motion graphics and extra deliverables need a custom quote.</p>
      <p>Unless your quote says so, the following are <strong>not included</strong>: scriptwriting, filming, voice-over, extensive illustration, 3D animation, stock footage or music beyond what we normally license, translations and subtitles in other languages.</p>
      <p>Prices exclude taxes. Any applicable tax is shown on your quote and invoice. Prices on the website may change, but the price in your accepted quote won't.</p>

      <h2 id="materials">3. Your materials and responsibilities</h2>
      <ul>
        <li>You confirm you own, or have permission to use, everything you send us: footage, photos, logos, music, fonts, product screens, scripts and the people who appear in them.</li>
        <li>You are responsible for the accuracy and legality of your video's content, claims, offers and prices, and for following the rules of the platforms where you post it (for example Instagram, YouTube or ad networks).</li>
        <li>You'll give feedback and approvals in reasonable time. If you're unresponsive for more than 30 days, we may close the project; work done so far stays payable.</li>
        <li>Please keep your own copies of your files. We aren't responsible for material lost before it reaches us.</li>
      </ul>

      <h2 id="process">4. How projects run</h2>
      <p><strong>Reels:</strong> we review your footage and brief, prepare an editing plan or storyboard when useful, get your approval, complete the edit, share a review version, then make the included revisions.</p>
      <p><strong>SaaS and launch videos:</strong> brief and script, sketch storyboard (you approve), visual design and style frames (you approve), motion graphics, then revisions and delivery. Changes to a storyboard or design after you've approved it are quoted separately.</p>
      <p>Your approval of a stage, or of the final review version, means that stage is accepted.</p>

      <h2 id="revisions">5. Revisions</h2>
      <p>Each package includes the number of revision rounds shown on our pricing and in your quote. A revision is a change within the agreed scope, sent as one consolidated list. New ideas, new footage or changes to approved stages are extra work and will be quoted before we do them. We don't offer unlimited revisions.</p>

      <h2 id="payment">6. Payment</h2>
      <div class="legal__box">
        <p><strong>Reels:</strong> 50% upfront to begin work. The remaining 50% is due after the edit is complete and before we deliver the final, unwatermarked file.</p>
        <p><strong>SaaS and launch videos:</strong> 50% upfront before work begins. The remaining 50% is due after you approve the visual designs and before animation starts.</p>
      </div>
      <p>Review versions may carry a watermark and must not be published. Final files are delivered once payment is complete. Prices are in Indian Rupees unless your quote is in another currency; any bank, transfer or currency fees on your side are yours.</p>

      <h2 id="delivery">7. Delivery and timelines</h2>
      <p>We'll give you an estimated delivery date with your quote. Dates depend on receiving your materials, feedback and payments on time. We deliver the formats listed in your quote. We keep project files for 30 days after delivery, after which we may delete them; ask us if you need them archived for longer.</p>

      <h2 id="ownership">8. Ownership, licences and portfolio</h2>
      <p>Once you've paid in full, you may use the final delivered video for your business: social media, websites and advertising. Until then, all rights stay with us.</p>
      <p>We keep ownership of our working files, project files, and any templates, presets, tools and know-how we made before or outside your project. Source and project files are not included unless your quote says so.</p>
      <p>Licensed music, fonts, stock or other third-party assets are used under their own licence terms, which we'll share where they affect you (for example, some music licences don't cover paid ads or don't transfer to your own channels).</p>
      <p>We will only show your project in our portfolio, website or social media with your permission. Testimonials we publish are real and used with the client's consent.</p>

      <h2 id="results">9. No guarantee of results</h2>
      <p>We work hard to make videos that perform, but views, reach, followers, leads, sales and platform decisions (such as reach limits, copyright claims or ad approvals) are outside our control. We don't guarantee any particular result.</p>

      <h2 id="liability">10. Liability and indemnity</h2>
      <p>To the extent the law allows, our total liability for any project is limited to the amount you paid us for that project, and we aren't liable for indirect or consequential losses such as lost profits, revenue or data. Nothing in these terms limits liability that can't be limited by law.</p>
      <p>You agree to cover our reasonable costs if a third party makes a claim against us because of material you supplied or content you asked us to include.</p>

      <h2 id="ending">11. Cancellation and ending a project</h2>
      <p>Cancellations and refunds follow our <a href="/refunds.html">Refund &amp; Cancellation Policy</a>. Either side may end a project by email if the other seriously breaks these terms and doesn't fix it within 7 days of being told.</p>

      <h2 id="force">12. Things outside our control</h2>
      <p>Neither side is responsible for delays caused by events beyond reasonable control, such as illness, power or internet outages, natural disasters or platform outages. We'll tell you quickly and agree a new date.</p>

      <h2 id="law">13. Governing law and disputes</h2>
      <p>These terms are governed by the laws of India. We'll always try to resolve a problem by talking first; if we can't, the courts at Udaipur, Rajasthan have jurisdiction.</p>

      <h2 id="general">14. General</h2>
      <p>These terms, together with your quote, are the whole agreement for your project. If a part is found unenforceable, the rest still applies. We may update these terms; the version in force when you accepted your quote applies to that project.</p>

      <h2 id="contact">15. Contact and complaints</h2>{GRIEVANCE}
"""

PRIVACY = f"""
      <p>This policy explains what personal data Odd Orange collects, why, how long we keep it and your rights. We collect as little as we can and never sell it. It is written to meet India's Digital Personal Data Protection Act, 2023 and the rules made under it.</p>

      <h2 id="controller">1. Who is responsible for your data</h2>{BUSINESS}

      <h2 id="collect">2. What we collect</h2>
      <ul>
        <li><strong>Enquiry form:</strong> your name, email, brand or company, the service you're interested in and your message, plus the date you sent it.</li>
        <li><strong>Emails and messages</strong> you send us, and any files or links you share for a project (these may show people, including you).</li>
        <li><strong>Billing details</strong> needed to invoice you, such as your name, business name, address and tax number. We never ask for card numbers or banking passwords.</li>
      </ul>
      <p>We don't use analytics, advertising, tracking pixels or tracking cookies. See our <a href="/cookies.html">Cookie Notice</a>.</p>

      <h2 id="use">3. Why we use it</h2>
      <ul>
        <li>To reply to your enquiry and send a quote (with your consent, given on the form).</li>
        <li>To deliver, invoice and support your project (to perform our agreement with you).</li>
        <li>To keep records the law requires, such as tax records.</li>
      </ul>
      <p>We don't send marketing emails unless you've asked for them, and you can stop them at any time.</p>

      <h2 id="processors">4. Services that handle data for us</h2>
      <ul>
        <li><strong>Netlify, Inc.</strong> (USA) hosts this website and receives enquiry-form submissions so we can read them.</li>
        <li><strong>Google Workspace</strong> (Google LLC) runs our email.</li>
        <li><strong>YouTube</strong> (Google LLC) plays our videos, but only after you press play (see section 5).</li>
        <li><strong>Calendly</strong> (Calendly LLC, USA) takes bookings if you choose to book a call with us; the call itself runs on Google Meet.</li>
        <li>File-sharing services you choose to send footage with (for example Google Drive or WeTransfer) handle your files under their own policies.</li>
      </ul>
      <p>Some of these providers store data outside India. We use reputable providers and only share what's needed. Fonts are hosted on our own website, so loading a page sends nothing to Google Fonts.</p>

      <h2 id="videos">5. Embedded videos</h2>
      <p>Our videos are hosted on YouTube. Nothing loads from YouTube until you press a play button. When you do, the video plays in YouTube's privacy-enhanced mode (youtube-nocookie.com), YouTube receives your IP address and device information, and YouTube's own <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">privacy policy</a> applies.</p>

      <h2 id="retention">6. How long we keep it</h2>
      <p>Enquiries that don't become projects are deleted within 12 months. Project files are kept for 30 days after delivery unless you ask us to keep them longer. Invoices and billing records are kept for as long as tax law requires.</p>

      <h2 id="security">7. Keeping it safe</h2>
      <p>The site is served only over encrypted HTTPS, our accounts use strong passwords and two-step verification, and only Harshul Joshi has access to your data. If a breach ever affected your data, we'd tell you and the authorities as the law requires.</p>

      <h2 id="rights">8. Your rights</h2>
      <p>You can ask us to: see what data we hold about you, correct or update it, delete it, or withdraw your consent (this doesn't affect anything done before). You can also nominate someone to exercise these rights for you. Email us and we'll respond promptly. If you're unhappy with our answer, you may complain to the Data Protection Board of India.</p>

      <h2 id="children">9. Children</h2>
      <p>Our services are for businesses and adults. We don't knowingly collect data from anyone under 18.</p>

      <h2 id="changes">10. Changes</h2>
      <p>If we change this policy, we'll update the date at the top. Significant changes will be highlighted on this page.</p>

      <h2 id="grievance">11. Questions and complaints</h2>{GRIEVANCE}
"""

COOKIES = f"""
      <p>Short version: <strong>this website doesn't use cookies.</strong></p>

      <h2 id="what">1. What we use</h2>
      <p>We don't use analytics, advertising or tracking cookies, and no third-party scripts run when a page loads. Fonts and images come from our own website.</p>
      <p>The site uses your browser's <em>session storage</em> to remember, for the current visit only, that you've already seen the opening animation, so it doesn't replay on every page. It's deleted when you close the tab, can't identify you and is never shared.</p>

      <h2 id="youtube">2. YouTube videos</h2>
      <p>Our videos come from YouTube, but nothing loads until you press play. Once you do, YouTube may set its own cookies or similar storage on your device, under <a href="https://policies.google.com/technologies/cookies" target="_blank" rel="noopener">Google's cookie policy</a>.</p>

      <h2 id="consent">3. Why there's no cookie banner</h2>
      <p>Because we only use storage that's strictly needed for the site to work as you'd expect, and nothing that tracks you, there's nothing to ask your consent for. If we ever add analytics or other non-essential cookies, we'll ask first.</p>

      <h2 id="contact">4. Questions</h2>
      <p>Email {MAIL}. See also our <a href="/privacy.html">Privacy Policy</a>.</p>
"""

REFUNDS = f"""
      <p>We keep payments simple so you always know where you stand. This policy explains what happens if you need to cancel. Your written quote may add details for your project.</p>

      <h2 id="deposit">1. Why we take a deposit</h2>
      <p>Every project starts with a 50% upfront payment. It reserves time in our schedule and covers the planning and work at the start of your project.</p>

      <h2 id="reels">2. Reels editing</h2>
      <ul>
        <li><strong>Before we start work:</strong> cancel and we'll refund your upfront payment in full.</li>
        <li><strong>After we've started editing:</strong> the upfront payment is non-refundable, as it covers work already done.</li>
        <li><strong>After the edit is complete:</strong> the remaining 50% is due before we deliver the final, unwatermarked file.</li>
      </ul>

      <h2 id="motion">3. SaaS explainers and launch videos</h2>
      <ul>
        <li><strong>Before storyboard work starts:</strong> cancel and we'll refund your upfront payment in full.</li>
        <li><strong>During the brief, storyboard or visual design stages:</strong> the upfront payment is non-refundable, as it covers this work.</li>
        <li><strong>After you approve the visual designs:</strong> the second 50% is due before animation starts. Once animation has started, payments are non-refundable.</li>
      </ul>

      <h2 id="our-side">4. If we can't finish your project</h2>
      <p>If we have to cancel for reasons on our side, we'll refund any payment for work we haven't delivered.</p>

      <h2 id="changes">5. Revisions and changes</h2>
      <p>Each package includes the revision rounds listed on our pricing. Extra revisions, or changes to an approved storyboard or design, are quoted separately and aren't grounds for a refund. If something we delivered doesn't match what we agreed, tell us within 7 days of delivery and we'll fix it.</p>

      <h2 id="how">6. How refunds are paid</h2>
      <p>Approved refunds go back to your original payment method within 7–10 working days. We don't charge cancellation fees beyond what's described here.</p>

      <h2 id="cancel">7. How to cancel</h2>
      <p>Email {MAIL} with your project name. The date we receive your email is the cancellation date.</p>

      <h2 id="complaints">8. Complaints</h2>{GRIEVANCE}
"""

NOT_FOUND = """
      <div class="not-found">
        <h1>Odd. <em>404.</em></h1>
        <p>This page rolled out of the crate.</p>
        <a class="btn btn--primary" href="/">Back to the home page</a>
      </div>"""


def todo(text):
    return re.sub(r'TODO\((.*?)\)', r'<mark class="todo">\1</mark>', text)


def toc(body):
    items = re.findall(r'<h2 id="([^"]+)">\d+\. ([^<]+)</h2>', body)
    if not items:
        return ''
    links = ''.join(f'<li><a href="#{i}">{t}</a></li>' for i, t in items)
    return f'      <ul class="legal__toc">{links}</ul>\n'


PAGES = [
    ('terms.html', 'Terms of Service', 'How Odd Orange works with clients: quotes, approvals, revisions, payment, ownership and liability.', TERMS),
    ('privacy.html', 'Privacy Policy', 'What personal data Odd Orange collects, why, how long we keep it and your rights.', PRIVACY),
    ('cookies.html', 'Cookie Notice', 'Odd Orange does not use cookies. What the site stores, and how embedded YouTube videos work.', COOKIES),
    ('refunds.html', 'Refund &amp; Cancellation Policy', 'How cancellations and refunds work for Odd Orange projects.', REFUNDS),
]

for filename, title, desc, body in PAGES:
    html = PAGE.format(title=title, desc=desc, updated=UPDATED, body=toc(body) + todo(body), mark=MARK, mail=MAIL)
    (ROOT / filename).write_text(html)
    print('wrote', filename)

nf = PAGE.format(title='Page not found', desc='This page could not be found.', updated=UPDATED, body=NOT_FOUND, mark=MARK, mail=MAIL)
nf = nf.replace('<main class="legal">\n      <h1>Page not found</h1>\n      <p class="label legal__updated">Last updated: ' + UPDATED + '</p>\n', '<main>\n')
(ROOT / '404.html').write_text(nf)
print('wrote 404.html')
