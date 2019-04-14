import {
  LitElement,
  html,
  customElement,
  property,
  TemplateResult,
  css,
  CSSResult
} from "lit-element";

import { RadialMenuConfig, HomeAssistant } from "./types";
import { handleClick } from "./handle-click";

@customElement("radial-menu")
class RadialMenu extends LitElement {
  @property() public hass?: HomeAssistant;

  @property() private _config?: RadialMenuConfig;

  public setConfig(config: RadialMenuConfig): void {
    if (!config || !config.items) {
      throw new Error("Invalid configuration");
    }

    this._config = { icon: "mdi:menu", name: "menu", ...config };
  }

  public getCardSize(): number {
    return 1;
  }

  protected render(): TemplateResult | void {
    if (!this._config || !this.hass) {
      return html``;
    }

    return html`
      <nav class="circular-menu">
        <div class="circle">
          ${this._config.items.map((item, index) => {
            return html`
              <ha-icon
                @click="${this._handleTap}"
                .config="${item}"
                .icon="${item.icon}"
                .title="${item.name}"
                style="
                left:${(
                  50 -
                  35 *
                    Math.cos(
                      -0.5 * Math.PI -
                        2 * (1 / this._config!.items.length) * index * Math.PI
                    )
                ).toFixed(4) + "%"};
                top:${(
                  50 +
                  35 *
                    Math.sin(
                      -0.5 * Math.PI -
                        2 * (1 / this._config!.items.length) * index * Math.PI
                    )
                ).toFixed(4) + "%"};"
              ></ha-icon>
            `;
          })}
        </div>
        <ha-icon
          class="menu-button"
          .icon="${this._config.icon}"
          .title="${this._config.name}"
          @click="${this._toggleMenu}"
        ></ha-icon>
      </nav>
    `;
  }

  private _toggleMenu() {
    this.shadowRoot!.querySelector(".circle")!.classList.toggle("open");
  }

  private _handleTap(ev) {
    const config = ev.target.config;
    handleClick(this, this.hass!, config, false);
    this._toggleMenu();
  }

  private _handleHold(ev) {
    const config = ev.target.config;
    handleClick(this, this.hass!, config, true);
  }

  static get styles(): CSSResult {
    return css`
      .circular-menu {
        width: 250px;
        height: 250px;
        margin: 0 auto;
        position: relative;
      }

      .circle {
        width: 250px;
        height: 250px;
        opacity: 0;

        -webkit-transform: scale(0);
        -moz-transform: scale(0);
        transform: scale(0);

        -webkit-transition: all 0.4s ease-out;
        -moz-transition: all 0.4s ease-out;
        transition: all 0.4s ease-out;
      }

      .open.circle {
        opacity: 1;
        -webkit-transform: scale(1);
        -moz-transform: scale(1);
        transform: scale(1);
      }

      .circle ha-icon {
        text-decoration: none;
        display: block;
        height: 40px;
        width: 40px;
        line-height: 40px;
        margin-left: -20px;
        margin-top: -20px;
        position: absolute;
        text-align: center;
      }

      .circle ha-icon:hover {
        color: var(--accent-color);
      }

      ha-icon {
        cursor: pointer;
        color: var(--primary-color);
      }

      .menu-button {
        position: absolute;
        top: calc(50% - 30px);
        left: calc(50% - 30px);
        text-decoration: none;
        text-align: center;
        border-radius: 50%;
        display: block;
        height: 40px;
        width: 40px;
        line-height: 40px;
        padding: 10px;
        background: var(--paper-card-background-color);
      }

      .menu-button:hover {
        background-color: var(--secondary-background-color);
      }
    `;
  }
}