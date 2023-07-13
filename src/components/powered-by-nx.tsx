import clsx from "clsx";
import React from "react";
import styles from "./powered-by-nx.module.css";

export default function PoweredByNx(): JSX.Element {
  return (
    <section className="padding-vert--xl container">
      <div className={clsx("row row--no-gutters shadow--md", styles.item)}>
        <div
          className="col col--6"
          aria-hidden="true"
          style={{
            backgroundImage: "url('/images/preview.avif')",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        ></div>
        <div className={clsx("col col--6", styles.item__inner)}>
          <div>
            <h1 className={clsx("margin-bottom--md", styles.item__title)}>
            Improve your CI/CD Workflows
            </h1>
            <p className="margin-bottom--md">
            Our experienced DevOps Engineers will provide insights into the efficiency and effectiveness of your current software delivery systems and help identify areas for improvement to ensure your CI/CD workflows are optimized for all your microservices.
            </p>
            <a className="button button--secondary" href="https://aws.amazon.com/marketplace/pp/prodview-soaz2d3nlms6k?sr=0-2&ref_=beagle&applicationId=AWSMPContessa">
            Purchase DevOps through the Amazon Marketplace
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
