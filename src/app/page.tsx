import { Header } from "@/components/Header";
import { Globe } from "@/components/Globe";
import { Icon } from "@/components/Icons";
import { reasons, services, site } from "@/lib/site";

export default function Home() {
  return <>
    <Header />
    <main>
      <section id="home" className="hero">
        <div className="hero-sheen" aria-hidden="true"/>
        <div className="container hero-layout">
          <div className="hero-content">
            <div className="eyebrow eyebrow-light"><span className="eyebrow-line"/> BRIDGING WORLDS, SERVING NRIs</div>
            <h1>Your India,<br/><em>Our Responsibility.</em></h1>
            <p className="hero-subhead">Complete NRI Services, <strong>Made Simple.</strong></p>
            <p className="hero-description">Living abroad shouldn&apos;t make managing your responsibilities in India difficult. We bring support, guidance and peace of mind closer to you — wherever you call home.</p>
            <div className="hero-actions"><a className="button button-gold" href="#services">Explore our services <Icon name="arrow" size={18}/></a><a className="hero-secondary" href="#about">Get to know us <span aria-hidden="true">↗</span></a></div>
            <div className="hero-proof"><span className="proof-symbol">✧</span> A Unit of Eternal Group of India</div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="ens-globe-visual"><Globe /></div>
            <div className="art-caption"><span>CONNECTED TO HOME</span><strong>Wherever life takes you.</strong></div>
          </div>
        </div>
      </section>

      <section className="intro-strip" aria-label="Our commitment"><div className="container strip-content"><span>YOUR TRUSTED PARTNER IN INDIA</span><span className="strip-separator"/> <span>CONVENIENCE</span><span className="strip-dot">✦</span><span>CARE</span><span className="strip-dot">✦</span><span>TRUST</span></div></section>

      <section id="about" className="section about-section"><div className="container about-grid">
        <div><div className="eyebrow">01 / ABOUT ETERNAL NRI SERVICES</div><h2>Far from India.<br/><span className="serif-accent">Never far from support.</span></h2></div>
        <div className="about-copy"><p className="lead">At Eternal NRI Services (ENS), we help Non-Resident Indians manage their important needs in India with convenience, care, and trust.</p><p>From educational documentation and international shopping and shipping to property assistance, banking support, tax filing and other essential services, we aim to make managing your affairs in India simple and hassle-free.</p><p>With our dedicated team and customer-focused approach, we help you stay connected to India — wherever life takes you.</p><a className="text-link" href="#services">Discover how we help <Icon name="arrow" size={19}/></a></div>
      </div></section>

      <section id="services" className="section services-section"><div className="container">
        <div className="section-heading"><div><div className="eyebrow">02 / WHAT WE DO</div><h2>One trusted partner.<br/><span className="serif-accent">Many ways to help.</span></h2></div><p>Practical, India-based assistance for the everyday and important things that matter to NRIs.</p></div>
        <div className="services-grid">{services.map(service => <article key={service.id} className="service-card">
          <div className="service-card-top"><span className="service-icon"><Icon name={service.icon} size={26}/></span><span className="service-number">{service.number} / 07</span></div>
          <h3>{service.title}</h3><p className="service-intro">{service.intro}</p>
          <ul>{service.items.map(item => <li key={item}>{item}</li>)}</ul>
        </article>)}</div>
        <p className="services-note">Services involving banking, taxation, immigration or legal matters are assistance and coordination services, with qualified professionals involved where required.</p>
      </div></section>

      <section id="why-us" className="section why-section"><div className="container why-grid">
        <div><div className="eyebrow eyebrow-light">03 / THE ENS DIFFERENCE</div><h2>India feels closer<br/><span className="serif-accent">with the right support.</span></h2><p>Our purpose is simple: make it easier to manage your India-related needs while you build your life abroad.</p></div>
        <div className="reasons-list">{reasons.map((reason, index) => <div key={reason} className="reason-row"><span className="reason-number">0{index + 1}</span><strong>{reason}</strong><span className="reason-check"><Icon name="check" size={19}/></span></div>)}</div>
      </div></section>

      <section id="contact" className="section contact-section"><div className="container contact-content"><div className="eyebrow">04 / LET'S CONNECT</div><h2>Stay Connected to India,<br/><span className="serif-accent">Wherever You Are.</span></h2><p>Let us help you manage your needs in India with greater convenience and peace of mind.</p><div className="contact-status">Contact information will be added once confirmed by our team.</div><span className="contact-note">Your trusted partner in India, wherever you are.</span></div></section>
    </main>
    <footer className="footer"><div className="container footer-inner"><div className="footer-brand"><strong>ETERNAL NRI SERVICES</strong><span>Bridging worlds, serving NRIs</span></div><span>{site.unit}</span><a href="#home" className="back-top">Back to top ↑</a></div><div className="container footer-bottom"><span>© 2026 Eternal NRI Services. All rights reserved.</span><span>Made to keep you close to home.</span></div></footer>
  </>;
}
