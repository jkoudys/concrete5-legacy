import EventEmitter from 'events';

class DeferredEventEmitter extends EventEmitter {
  // Is our emitter currently broadcasting events
  active = false;
  // If we're not emitting, queue them up here
  emits = [];

  /**
   * Emit an event if we're active, or queue it up if we're not
   */
  emit() {
    if (this.active) {
      super.emit.apply(this, arguments);
    } else {
      this.emits.push(arguments);
    }
  }

  /**
   * Activate, and process our queued up events
   */
  activate() {
    let event;
    this.active = true;

    while (event = this.emits.shift()) {
      super.emit.apply(this, event);
    }
  }
}

let siteActivated = true;

const Krete = {
  uiLoaded: false,
  animEffects: false,

  event: new DeferredEventEmitter(),

  deactivateSite(onDone) {
    if (siteActivated === false) return false;

    for (const el of document.querySelectorAll('embed, object')) {
      el.setAttribute('ccm-style-old-visibility', el.style.visibility);
      el.style.visibility = 'hidden';
    }

    document.getElementById('ccm-overlay').style.display = 'inherit';

    siteActivated = false;
    if (typeof onDone === 'function') onDone();

    return true;
  },

  activateSite() {
    document.getElementById('ccm-overlay').style.display = 'none';

    for (const el of document.querySelectorAll('embed, object')) {
      el.style.visibility = el.getAttribute('ccm-style-old-visibility');
    }

    siteActivated = true;
    Krete.topPaneDeactivated = false;
  },

  // called in versions popup
  disableLinks() {
    const td = document.createElement('DIV');
    Object.assign(td.style, {
      position: 'absolute',
      top: '0px',
      left: '0px',
      width: '100%',
      height: '100%',
      zIndex: 1000,
    });
    document.body.appendChild(td);
  },
};

// Namespace for c5.6 fork
Object.assign(window, { Krete });
