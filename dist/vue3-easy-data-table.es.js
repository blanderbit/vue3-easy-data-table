import { defineComponent as ne, useCssVars as Se, unref as s, computed as x, inject as ke, openBlock as v, createElementBlock as h, withModifiers as De, createElementVNode as $, normalizeClass as F, pushScopeId as we, popScopeId as Be, ref as q, watch as te, onMounted as nt, onBeforeUnmount as qt, toDisplayString as X, Fragment as ue, renderList as Ce, withDirectives as zt, normalizeStyle as me, createCommentVNode as z, vShow as ha, renderSlot as ee, createVNode as le, useSlots as Dt, withKeys as ba, toRefs as Ot, vModelCheckbox as xa, watchEffect as _a, provide as Lt, createBlock as de, isRef as At, normalizeProps as pe, mergeProps as $e, guardReactiveProps as at, createTextVNode as Mt, createSlots as Pa, withCtx as Rt } from "vue";
const Ca = (e) => (we("data-v-b32661f7"), e = e(), Be(), e), ka = ["onClick"], Sa = ["checked"], Na = /* @__PURE__ */ Ca(() => /* @__PURE__ */ $("label", { for: "checkbox" }, null, -1)), $a = /* @__PURE__ */ ne({
  props: {
    status: { type: String, required: !0 }
  },
  emits: ["change"],
  setup(e, { emit: t }) {
    const a = e;
    Se((p) => ({
      50605471: s(r)
    }));
    const n = x(() => a.status === "allSelected"), l = () => {
      t("change", !n.value);
    }, r = ke("themeColor");
    return (p, o) => (v(), h("div", {
      class: "easy-checkbox",
      onClick: De(l, ["stop", "prevent"])
    }, [
      $("input", {
        id: "checkbox",
        type: "checkbox",
        checked: s(n),
        class: F(e.status)
      }, null, 10, Sa),
      Na
    ], 8, ka));
  }
});
const ce = (e, t) => {
  const a = e.__vccOpts || e;
  for (const [n, l] of t)
    a[n] = l;
  return a;
}, Ia = /* @__PURE__ */ ce($a, [["__scopeId", "data-v-b32661f7"]]), wa = (e) => (we("data-v-3ccef1dc"), e = e(), Be(), e), Ba = ["checked"], Ta = /* @__PURE__ */ wa(() => /* @__PURE__ */ $("label", { for: "checkbox" }, null, -1)), La = /* @__PURE__ */ ne({
  props: {
    checked: { type: Boolean, required: !0 }
  },
  emits: ["change"],
  setup(e, { emit: t }) {
    Se((n) => ({
      "31b2b268": s(a)
    }));
    const a = ke("themeColor");
    return (n, l) => (v(), h("div", {
      class: "easy-checkbox",
      onClick: l[0] || (l[0] = De((r) => t("change"), ["stop", "prevent"]))
    }, [
      $("input", {
        id: "checkbox",
        type: "checkbox",
        checked: e.checked
      }, null, 8, Ba),
      Ta
    ]));
  }
});
const Aa = /* @__PURE__ */ ce(La, [["__scopeId", "data-v-3ccef1dc"]]), Ma = (e) => (we("data-v-944b0cb8"), e = e(), Be(), e), Ra = { class: "easy-data-table__rows-selector" }, Ea = { class: "rows-input" }, Ha = /* @__PURE__ */ Ma(() => /* @__PURE__ */ $("div", { class: "triangle" }, null, -1)), Fa = ["onClick"], qa = /* @__PURE__ */ ne({
  props: {
    modelValue: { type: Number, required: !0 },
    rowsItems: { type: Array, required: !0 }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const a = e;
    Se((N) => ({
      "1b09a322": s(C)
    }));
    const n = q(!1), l = q(!1), r = ke("dataTable");
    te(n, (N) => {
      if (N && r) {
        const k = window.innerHeight, f = r.value.getBoundingClientRect().height, w = r.value.getBoundingClientRect().top;
        k - (f + w) <= 100 ? l.value = !0 : l.value = !1;
      }
    });
    const p = x({
      get: () => a.modelValue,
      set: (N) => {
        t("update:modelValue", N);
      }
    }), o = (N) => {
      p.value = N, n.value = !1;
    }, i = (N, k) => {
      let f = N.parentNode;
      for (; f != null; ) {
        if (f.classList && f.classList.contains(k))
          return !0;
        f = f.parentNode;
      }
      return !1;
    }, c = (N) => {
      i(N.target, "easy-data-table__rows-selector") || (n.value = !1);
    };
    nt(() => {
      document.addEventListener("click", c);
    }), qt(() => {
      document.removeEventListener("click", c);
    });
    const C = ke("themeColor");
    return (N, k) => (v(), h("div", Ra, [
      $("div", {
        class: "rows-input__wrapper",
        onClick: k[0] || (k[0] = (f) => n.value = !n.value)
      }, [
        $("div", Ea, X(s(p)), 1),
        Ha
      ]),
      $("ul", {
        class: F(["select-items", { show: n.value, inside: l.value }])
      }, [
        (v(!0), h(ue, null, Ce(e.rowsItems, (f) => (v(), h("li", {
          key: f,
          class: F({ selected: f === s(p) }),
          onClick: (w) => o(f)
        }, X(f), 11, Fa))), 128))
      ], 2)
    ]));
  }
});
const za = /* @__PURE__ */ ce(qa, [["__scopeId", "data-v-944b0cb8"]]), Ye = (e) => (we("data-v-b6ffe197"), e = e(), Be(), e), Da = { class: "lds-ring" }, Oa = /* @__PURE__ */ Ye(() => /* @__PURE__ */ $("div", null, null, -1)), Va = /* @__PURE__ */ Ye(() => /* @__PURE__ */ $("div", null, null, -1)), Ua = /* @__PURE__ */ Ye(() => /* @__PURE__ */ $("div", null, null, -1)), Wa = /* @__PURE__ */ Ye(() => /* @__PURE__ */ $("div", null, null, -1)), Ga = [
  Oa,
  Va,
  Ua,
  Wa
], ja = /* @__PURE__ */ ne({
  setup(e) {
    Se((a) => ({
      "0aa0de6e": s(t)
    }));
    const t = ke("themeColor");
    return (a, n) => (v(), h("div", Da, Ga));
  }
});
const Ka = /* @__PURE__ */ ce(ja, [["__scopeId", "data-v-b6ffe197"]]), Xa = { class: "loader-line" }, Ya = /* @__PURE__ */ ne({
  setup(e) {
    Se((a) => ({
      "73c85eb6": s(t)
    }));
    const t = ke("themeColor");
    return (a, n) => (v(), h("div", Xa));
  }
});
const Za = /* @__PURE__ */ ce(Ya, [["__scopeId", "data-v-40839403"]]), Ja = { class: "buttons-pagination" }, Qa = ["onClick"], en = /* @__PURE__ */ ne({
  props: {
    maxPaginationNumber: { type: Number, required: !0 },
    currentPaginationNumber: { type: Number, required: !0 }
  },
  emits: ["updatePage"],
  setup(e, { emit: t }) {
    const a = e;
    Se((o) => ({
      "69ec79fa": s(p)
    }));
    const n = 7, l = (o) => {
      o.type === "button" && !o.active && t("updatePage", o.page);
    }, r = x(() => {
      const o = [];
      if (a.maxPaginationNumber <= n)
        for (let i = 1; i <= a.maxPaginationNumber; i += 1)
          o.push({
            type: "button",
            page: i,
            active: i === a.currentPaginationNumber,
            activePrev: i + 1 === a.currentPaginationNumber
          });
      else if ([1, 2, a.maxPaginationNumber, a.maxPaginationNumber - 1].includes(a.currentPaginationNumber))
        for (let i = 1; i <= n; i += 1)
          if (i <= 3)
            o.push({
              type: "button",
              page: i,
              active: i === a.currentPaginationNumber,
              activePrev: i + 1 === a.currentPaginationNumber
            });
          else if (i === 4)
            o.push({
              type: "omission"
            });
          else {
            const c = a.maxPaginationNumber - (n - i);
            o.push({
              type: "button",
              page: c,
              active: c === a.currentPaginationNumber,
              activePrev: c + 1 === a.currentPaginationNumber
            });
          }
      else if ([3, 4].includes(a.currentPaginationNumber))
        for (let i = 1; i <= n; i += 1)
          i <= 5 ? o.push({
            type: "button",
            page: i,
            active: i === a.currentPaginationNumber,
            activePrev: i + 1 === a.currentPaginationNumber
          }) : i === 6 ? o.push({
            type: "omission"
          }) : o.push({
            type: "button",
            page: a.maxPaginationNumber,
            active: a.maxPaginationNumber === a.currentPaginationNumber,
            activePrev: i + 1 === a.currentPaginationNumber
          });
      else if ([a.maxPaginationNumber - 2, a.maxPaginationNumber - 3].includes(a.currentPaginationNumber))
        for (let i = 1; i <= n; i += 1)
          if (i === 1)
            o.push({
              type: "button",
              page: 1,
              active: a.currentPaginationNumber === 1,
              activePrev: i + 1 === a.currentPaginationNumber
            });
          else if (i === 2)
            o.push({
              type: "omission"
            });
          else {
            const c = a.maxPaginationNumber - (n - i);
            o.push({
              type: "button",
              page: c,
              active: c === a.currentPaginationNumber,
              activePrev: c + 1 === a.currentPaginationNumber
            });
          }
      else
        for (let i = 1; i <= n; i += 1)
          if (i === 1)
            o.push({
              type: "button",
              page: 1,
              active: a.currentPaginationNumber === 1,
              activePrev: i + 1 === a.currentPaginationNumber
            });
          else if (i === 2 || i === 6)
            o.push({
              type: "omission"
            });
          else if (i === 7)
            o.push({
              type: "button",
              page: a.maxPaginationNumber,
              active: a.maxPaginationNumber === a.currentPaginationNumber,
              activePrev: i + 1 === a.currentPaginationNumber
            });
          else {
            const c = 4 - i, C = a.currentPaginationNumber - c;
            o.push({
              type: "button",
              page: C,
              active: C === a.currentPaginationNumber,
              activePrev: C + 1 === a.currentPaginationNumber
            });
          }
      return o;
    }), p = ke("themeColor");
    return (o, i) => (v(), h("div", Ja, [
      (v(!0), h(ue, null, Ce(s(r), (c, C) => (v(), h("div", {
        key: C,
        class: F(["item", {
          button: c.type === "button",
          active: c.type === "button" && c.active,
          "active-prev": c.type === "button" && c.activePrev,
          omission: c.type === "omission"
        }]),
        onClick: (N) => l(c)
      }, X(c.type === "button" ? c.page : "..."), 11, Qa))), 128))
    ]));
  }
});
const tn = /* @__PURE__ */ ce(en, [["__scopeId", "data-v-08b918c0"]]);
function ve() {
  return ve = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var a = arguments[t];
      for (var n in a)
        Object.prototype.hasOwnProperty.call(a, n) && (e[n] = a[n]);
    }
    return e;
  }, ve.apply(this, arguments);
}
const Vt = [
  "horizontal",
  "vertical",
  "both"
], Ut = [
  "right",
  "left"
], ye = {
  type: [
    Number,
    String
  ],
  validator: (e) => /^[-\d.]+$/.test(`${e}`)
}, Ge = (e) => parseFloat(e);
function st(e, t, a) {
  let n, l;
  const r = "1em";
  let p, o, i, c = "-.125em";
  const C = "visible";
  return a && (i = "center", l = "1.25em"), t && (n = t), e && (e === "lg" ? (o = "1.33333em", p = ".75em", c = "-.225em") : e === "xs" ? o = ".75em" : e === "sm" ? o = ".875em" : o = e.replace("x", "em")), {
    float: n,
    width: l,
    height: r,
    "line-height": p,
    "font-size": o,
    "text-align": i,
    "vertical-align": c,
    "transform-origin": "center",
    overflow: C
  };
}
function Wt(e, t, a, n, l, r = 1, p = "", o = "") {
  let i = 1, c = 1;
  return l && (l === "horizontal" ? i = -1 : l === "vertical" ? c = -1 : i = c = -1), [
    `translate(${Ge(t) * r}${p},${Ge(a) * r}${p})`,
    `scale(${i * Ge(e)},${c * Ge(e)})`,
    n && `rotate(${n}${o})`
  ].join(" ");
}
var Ze = ne({
  props: {
    icon: {
      type: Object,
      required: !0
    },
    size: {
      type: String,
      validator: function(t) {
        return /^(lg|xs|sm|([\d.]+)x)$/.test(t);
      }
    },
    color: String,
    fw: Boolean,
    pull: {
      type: String,
      validator: function(t) {
        return Ut.indexOf(t) >= 0;
      }
    },
    scale: ve({}, ye, {
      default: 1
    }),
    translateX: ve({}, ye, {
      default: 0
    }),
    translateY: ve({}, ye, {
      default: 0
    }),
    flip: {
      type: String,
      validator: function(t) {
        return Vt.indexOf(t) >= 0;
      }
    },
    rotate: ye,
    spin: Boolean,
    pulse: Boolean,
    primaryColor: String,
    secondaryColor: String,
    primaryOpacity: {
      type: [Number, String],
      default: 1
    },
    secondaryOpacity: {
      type: [Number, String],
      default: 0.4
    },
    swapOpacity: Boolean
  },
  setup: function(t) {
    var a = function() {
      var l, r;
      return (l = (r = t.icon) == null ? void 0 : r.icon) != null ? l : [0, 0, "", [], ""];
    };
    return {
      i: x(a),
      style: x(function() {
        return a()[4] ? st(t.size, t.pull, t.fw) : {};
      }),
      transform: x(function() {
        return Wt(t.scale, t.translateX, t.translateY, t.rotate, t.flip, 512);
      })
    };
  }
});
we("data-v-7e44f4d4");
var an = ["viewBox"], nn = ["transform", "transform-origin"], sn = ["transform"], ln = ["d", "fill", "transform"], rn = ["d", "fill", "fill-opacity", "transform"], on = ["d", "fill", "fill-opacity", "transform"];
Be();
function un(e, t, a, n, l, r) {
  return zt((v(), h(
    "svg",
    {
      viewBox: "0 0 " + e.i[0] + " " + e.i[1],
      class: F({
        "vue-fa": !0,
        spin: e.spin,
        pulse: e.pulse
      }),
      style: me(e.style),
      "aria-hidden": "true",
      role: "img",
      xmlns: "http://www.w3.org/2000/svg"
    },
    [e.i[4] ? (v(), h(
      "g",
      {
        key: 0,
        transform: "translate(" + e.i[0] / 2 + " " + e.i[1] / 2 + ")",
        "transform-origin": e.i[0] / 4 + " 0"
      },
      [$(
        "g",
        {
          transform: e.transform
        },
        [typeof e.i[4] == "string" ? (v(), h(
          "path",
          {
            key: 0,
            d: e.i[4],
            fill: e.color || e.primaryColor || "currentColor",
            transform: "translate(" + e.i[0] / -2 + " " + e.i[1] / -2 + ")"
          },
          null,
          8,
          ln
        )) : (v(), h(
          ue,
          {
            key: 1
          },
          [$(
            "path",
            {
              d: e.i[4][0],
              fill: e.secondaryColor || e.color || "currentColor",
              "fill-opacity": e.swapOpacity !== !1 ? e.primaryOpacity : e.secondaryOpacity,
              transform: "translate(" + e.i[0] / -2 + " " + e.i[1] / -2 + ")"
            },
            null,
            8,
            rn
          ), $(
            "path",
            {
              d: e.i[4][1],
              fill: e.primaryColor || e.color || "currentColor",
              "fill-opacity": e.swapOpacity !== !1 ? e.secondaryOpacity : e.primaryOpacity,
              transform: "translate(" + e.i[0] / -2 + " " + e.i[1] / -2 + ")"
            },
            null,
            8,
            on
          )],
          64
          /* STABLE_FRAGMENT */
        ))],
        8,
        sn
      )],
      8,
      nn
    )) : z("v-if", !0)],
    14,
    an
  )), [[ha, e.i[4]]]);
}
function Gt(e, t) {
  t === void 0 && (t = {});
  var a = t.insertAt;
  if (!(!e || typeof document > "u")) {
    var n = document.head || document.getElementsByTagName("head")[0], l = document.createElement("style");
    l.type = "text/css", a === "top" && n.firstChild ? n.insertBefore(l, n.firstChild) : n.appendChild(l), l.styleSheet ? l.styleSheet.cssText = e : l.appendChild(document.createTextNode(e));
  }
}
var cn = "@-webkit-keyframes spin-7e44f4d4{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}to{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes spin-7e44f4d4{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}to{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}.spin[data-v-7e44f4d4]{-webkit-animation:spin-7e44f4d4 2s 0s infinite linear;animation:spin-7e44f4d4 2s 0s infinite linear}.pulse[data-v-7e44f4d4]{-webkit-animation:spin-7e44f4d4 1s infinite steps(8);animation:spin-7e44f4d4 1s infinite steps(8)}";
Gt(cn);
Ze.render = un;
Ze.__scopeId = "data-v-7e44f4d4";
Ze.__file = "src/fa.vue";
var lt = ne({
  props: {
    size: {
      type: String,
      validator: function(t) {
        return /^(lg|xs|sm|([\d.]+)x)$/.test(t);
      }
    },
    pull: {
      type: String,
      validator: function(t) {
        return Ut.indexOf(t) >= 0;
      }
    }
  },
  setup: function(t) {
    return {
      style: x(function() {
        return st(t.size, t.pull, !0);
      })
    };
  }
});
function dn(e, t, a, n, l, r) {
  return v(), h(
    "span",
    {
      class: "vue-fa-layers",
      style: me(e.style)
    },
    [ee(e.$slots, "default")],
    4
    /* STYLE */
  );
}
var pn = ".vue-fa-layers[data-v-62be850b]{display:inline-block;position:relative}.vue-fa-layers[data-v-62be850b] .vue-fa{position:absolute;bottom:0;left:0;right:0;top:0;margin:auto;text-align:center}.vue-fa-layers[data-v-62be850b] .vue-fa-layers-text{position:absolute;top:50%;left:50%;-webkit-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}.vue-fa-layers[data-v-62be850b] .vue-fa-layers-text span{display:inline-block}";
Gt(pn);
lt.render = dn;
lt.__scopeId = "data-v-62be850b";
lt.__file = "src/fa-layers.vue";
var jt = ne({
  props: {
    size: {
      type: String,
      validator: function(t) {
        return /^(lg|xs|sm|([\d.]+)x)$/.test(t);
      }
    },
    color: String,
    scale: ve({}, ye, {
      default: 1
    }),
    translateX: ve({}, ye, {
      default: 0
    }),
    translateY: ve({}, ye, {
      default: 0
    }),
    flip: {
      type: String,
      validator: function(t) {
        return Vt.indexOf(t) >= 0;
      }
    },
    rotate: ye
  },
  setup: function(t) {
    return {
      style: x(function() {
        return ve({}, st(t.size), {
          color: t.color,
          transform: Wt(t.scale, t.translateX, t.translateY, t.rotate, t.flip, void 0, "em", "deg")
        });
      })
    };
  }
}), fn = {
  class: "vue-fa-layers-text"
};
function vn(e, t, a, n, l, r) {
  return v(), h("span", fn, [$(
    "span",
    {
      style: me(e.style)
    },
    [ee(e.$slots, "default")],
    4
    /* STYLE */
  )]);
}
jt.render = vn;
jt.__file = "src/fa-layers-text.vue";
var gn = {
  prefix: "fas",
  iconName: "sort-down",
  icon: [320, 512, ["sort-desc"], "f0dd", "M182.6 470.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128z"]
}, mn = {
  prefix: "fas",
  iconName: "square-minus",
  icon: [448, 512, [61767, "minus-square"], "f146", "M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm88 200H296c13.3 0 24 10.7 24 24s-10.7 24-24 24H152c-13.3 0-24-10.7-24-24s10.7-24 24-24z"]
}, yn = mn, hn = {
  prefix: "fas",
  iconName: "angle-right",
  icon: [256, 512, [8250], "f105", "M246.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L178.7 256 41.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"]
}, bn = {
  prefix: "fas",
  iconName: "square-plus",
  icon: [448, 512, [61846, "plus-square"], "f0fe", "M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM200 344V280H136c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H248v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"]
}, xn = bn, _n = {
  prefix: "fas",
  iconName: "angles-right",
  icon: [448, 512, [187, "angle-double-right"], "f101", "M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L370.7 256 233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160zm-352 160l160-160c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L178.7 256 41.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0z"]
}, Pn = {
  prefix: "fas",
  iconName: "sort",
  icon: [320, 512, ["unsorted"], "f0dc", "M137.4 41.4c12.5-12.5 32.8-12.5 45.3 0l128 128c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l128-128zm0 429.3l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128c-12.5 12.5-32.8 12.5-45.3 0z"]
}, Cn = {
  prefix: "fas",
  iconName: "sort-up",
  icon: [320, 512, ["sort-asc"], "f0de", "M182.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8H288c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z"]
}, kn = {
  prefix: "fas",
  iconName: "sliders",
  icon: [512, 512, ["sliders-h"], "f1de", "M0 416c0-17.7 14.3-32 32-32l54.7 0c12.3-28.3 40.5-48 73.3-48s61 19.7 73.3 48L480 384c17.7 0 32 14.3 32 32s-14.3 32-32 32l-246.7 0c-12.3 28.3-40.5 48-73.3 48s-61-19.7-73.3-48L32 448c-17.7 0-32-14.3-32-32zm192 0a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM384 256a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm-32-80c32.8 0 61 19.7 73.3 48l54.7 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-54.7 0c-12.3 28.3-40.5 48-73.3 48s-61-19.7-73.3-48L32 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l246.7 0c12.3-28.3 40.5-48 73.3-48zM192 64a32 32 0 1 0 0 64 32 32 0 1 0 0-64zm73.3 0L480 64c17.7 0 32 14.3 32 32s-14.3 32-32 32l-214.7 0c-12.3 28.3-40.5 48-73.3 48s-61-19.7-73.3-48L32 128C14.3 128 0 113.7 0 96S14.3 64 32 64l86.7 0C131 35.7 159.2 16 192 16s61 19.7 73.3 48z"]
}, Sn = kn, Nn = {
  prefix: "fas",
  iconName: "bars-staggered",
  icon: [512, 512, ["reorder", "stream"], "f550", "M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM64 256c0-17.7 14.3-32 32-32H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H96c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"]
}, $n = Nn, In = {
  prefix: "fas",
  iconName: "angles-left",
  icon: [448, 512, [171, "angle-double-left"], "f100", "M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160zm352-160l-160 160c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L269.3 256 406.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0z"]
}, wn = {
  prefix: "fas",
  iconName: "angle-left",
  icon: [256, 512, [8249], "f104", "M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"]
}, Bn = {
  prefix: "fas",
  iconName: "circle-xmark",
  icon: [512, 512, [61532, "times-circle", "xmark-circle"], "f057", "M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"]
}, Tn = Bn;
function Ln(e) {
  return e.reduce((t, a) => (t[a.prefix] = t[a.prefix] ? {
    ...t[a.prefix],
    [a.iconName]: a
  } : { [a.iconName]: a }, a.icon[2].forEach((n) => {
    typeof n == "string" && (t[a.prefix][n] = a);
  }), t), {});
}
const An = [
  Sn,
  wn,
  In,
  hn,
  _n,
  $n,
  Tn,
  xn,
  yn,
  Pn,
  Cn,
  gn
], Mn = Ln(An), Rn = Ze, En = { class: "app-icon" }, re = {
  props: {
    namespace: {
      type: String,
      default: "fas",
      note: "Default namespace"
    },
    icon: {
      type: [String, Object],
      required: !0
    },
    size: {
      type: String,
      default: null
    },
    additionalClass: {
      type: [String, Object],
      default: ""
    }
  },
  setup(e) {
    const t = e, a = x(() => {
      var r;
      let { icon: n } = t;
      typeof n == "object" && ([n] = Object.keys(n).filter((p) => n[p]));
      const l = (r = Mn[t.namespace]) == null ? void 0 : r[n];
      return l || (console.error("Could not find one or more icon(s)", {
        prefix: t.namespace,
        iconName: t.icon
      }), {});
    });
    return (n, l) => (v(), h("span", En, [
      le(s(Rn), {
        icon: s(a),
        class: F([e.additionalClass, "icon"]),
        size: e.size
      }, null, 8, ["icon", "class", "size"]),
      ee(n.$slots, "default")
    ]));
  }
}, Hn = /* @__PURE__ */ ne({
  props: {
    isFirstPage: { type: Boolean, required: !1 },
    isLastPage: { type: Boolean, required: !1 },
    hasDoubleArrows: { type: Boolean, default: !1 }
  },
  emits: ["clickFirstPage", "clickPrevPage", "clickNextPage", "clickLastPage"],
  setup(e, { emit: t }) {
    const a = Dt();
    return (n, l) => (v(), h(ue, null, [
      e.hasDoubleArrows ? (v(), h("div", {
        key: 0,
        class: F(["first-page__click-button", { "first-page": e.isFirstPage }]),
        "data-test-id": "first-page-click-button",
        onClick: l[0] || (l[0] = (r) => t("clickFirstPage"))
      }, [
        le(re, {
          "data-test-id": "arrow-left-icon",
          class: "arrow arrow-left",
          icon: "angles-left",
          size: "lg"
        })
      ], 2)) : z("", !0),
      $("div", {
        class: F(["previous-page__click-button", { "first-page": e.isFirstPage }]),
        onClick: l[1] || (l[1] = (r) => t("clickPrevPage"))
      }, [
        le(re, {
          class: "arrow arrow-left",
          icon: "angle-left",
          size: "lg"
        })
      ], 2),
      s(a).buttonsPagination ? ee(n.$slots, "buttonsPagination", { key: 1 }, void 0, !0) : z("", !0),
      s(a).paginationWithInput ? ee(n.$slots, "paginationWithInput", { key: 2 }, void 0, !0) : z("", !0),
      $("div", {
        class: F(["next-page__click-button", { "last-page": e.isLastPage }]),
        onClick: l[2] || (l[2] = (r) => t("clickNextPage"))
      }, [
        le(re, {
          class: "arrow arrow-right",
          icon: "angle-right",
          size: "lg"
        })
      ], 2),
      e.hasDoubleArrows ? (v(), h("div", {
        key: 3,
        class: F(["last-page__click-button", { "last-page": e.isLastPage }]),
        "data-test-id": "last-page-click-button",
        onClick: l[3] || (l[3] = (r) => t("clickLastPage"))
      }, [
        le(re, {
          "data-test-id": "arrow-right-icon",
          class: "arrow arrow-right",
          icon: "angles-right",
          size: "lg"
        })
      ], 2)) : z("", !0)
    ], 64));
  }
});
const Fn = /* @__PURE__ */ ce(Hn, [["__scopeId", "data-v-d9bd427a"]]), qn = {
  class: "pagination-with-input",
  "data-test-id": "pagination-with-input"
}, zn = ["value"], Dn = /* @__PURE__ */ ne({
  props: {
    maxPaginationNumber: { type: Number, required: !0 },
    currentPaginationNumber: { type: Number, required: !0 }
  },
  emits: ["updatePage"],
  setup(e, { emit: t }) {
    const a = e, n = (l) => {
      const r = parseInt(l, 10);
      r > 0 && r <= a.maxPaginationNumber && r !== a.currentPaginationNumber && t("updatePage", r);
    };
    return (l, r) => (v(), h("div", qn, [
      $("input", {
        value: e.currentPaginationNumber,
        class: "input",
        "data-test-id": "pagination-with-input-control-el",
        onBlur: r[0] || (r[0] = (p) => n(p.target.value)),
        onKeyup: r[1] || (r[1] = ba((p) => n(p.target.value), ["enter"]))
      }, null, 40, zn)
    ]));
  }
});
const On = /* @__PURE__ */ ce(Dn, [["__scopeId", "data-v-f760a218"]]);
function Vn(e, t) {
  if (!e)
    return;
  const a = (n) => {
    n.target !== e.value && n.composedPath().includes(e.value) || typeof t == "function" && t();
  };
  nt(() => {
    window.addEventListener("click", a);
  }), qt(() => {
    window.removeEventListener("click", a);
  });
}
const Un = { class: "manage-table-properties__body" }, Wn = { class: "properties" }, Gn = ["id", "value", "disabled"], jn = ["for"], Kn = /* @__PURE__ */ ne({
  props: {
    columns: { type: Array, required: !0 },
    modelValue: { type: Array, required: !0 },
    label: { type: String, default: null }
  },
  emits: ["set-checked-table-properties", "close"],
  setup(e, { emit: t }) {
    const a = e, { columns: n, modelValue: l } = Ot(a), r = 8, p = q([]), o = q(null), i = x(() => n.value.map((c) => {
      const C = c.groupable && c.grouped || p.value.length === 1 && p.value[0] === c.value, N = c.text.length > r ? `${c.text.slice(0, r)}...` : c.text;
      return {
        ...c,
        disabled: C,
        shortTitle: N
      };
    }));
    return te(l, (c) => {
      p.value = c;
    }, {
      immediate: !0
    }), te(p, (c) => {
      t("set-checked-table-properties", c);
    }), Vn(o, () => {
      t("close");
    }), (c, C) => (v(), h("div", {
      ref_key: "manageTablePropertiesRef",
      ref: o,
      class: "manage-table-properties"
    }, [
      $("div", Un, [
        $("span", null, X(e.label), 1),
        $("div", Wn, [
          (v(!0), h(ue, null, Ce(s(i), (N) => (v(), h("div", {
            key: N.value,
            "data-test-id": "property-item",
            class: "properties__item"
          }, [
            zt($("input", {
              id: N.value,
              "onUpdate:modelValue": C[0] || (C[0] = (k) => p.value = k),
              type: "checkbox",
              value: N.value,
              disabled: N.disabled,
              "data-test-id": "property-item-checkbox",
              class: "properties__item__checkbox"
            }, null, 8, Gn), [
              [xa, p.value]
            ]),
            $("label", {
              class: "properties__item__label",
              for: N.value
            }, X(N.shortTitle), 9, jn)
          ]))), 128))
        ])
      ])
    ], 512));
  }
});
const Xn = /* @__PURE__ */ ce(Kn, [["__scopeId", "data-v-cf2c7c9f"]]);
function Yn(e, t, a, n, l, r) {
  const p = q(null), o = (k, f) => {
    k.forEach((w) => {
      w.meta.selected = f;
    });
  }, i = () => {
    o(t.value, !1);
  }, c = (k) => {
    let f = t.value.findIndex((y) => y.meta.uniqueIndex === k.meta.uniqueIndex), w = t.value.findIndex((y) => y.meta.uniqueIndex === p.value);
    [
      f,
      w
    ] = [
      f,
      w
    ].sort((y, P) => y - P), i();
    const Y = t.value.slice(f, w + 1);
    o(Y, !0), a.value = Y;
  }, C = (k) => {
    const f = k.meta.selected;
    e.value || i(), p.value = k.meta.uniqueIndex, k.meta.selected = !f, f ? a.value = a.value.filter((w) => k.meta.uniqueIndex !== w.meta.uniqueIndex) : !e.value && a.value.length === 1 ? (a.value[0].meta.selected = !1, a.value = [k]) : a.value.unshift(k);
  };
  return {
    clickRow: (k, f, w) => {
      if (n.value !== w)
        return;
      k.shiftKey && e.value ? c(f) : k.ctrlKey ? C(f) : (i(), p.value = f.meta.uniqueIndex, f.meta.selected = !0, a.value = [f]);
      const M = { ...f };
      if (l.value) {
        const { index: Y } = f;
        M.indexInCurrentPage = Y;
      }
      r("clickRow", M);
    }
  };
}
function Zn(e, t, a) {
  const n = q([]);
  return {
    expandingRowIndexList: n,
    updateExpandingItemIndexList: (p, o, i) => {
      i.stopPropagation();
      const c = n.value.indexOf(o.meta.uniqueIndex);
      if (c !== -1)
        n.value.splice(c, 1);
      else {
        const C = e.value.findIndex((N) => N.meta.uniqueIndex === o.meta.uniqueIndex);
        a("expandRow", t.value + C), n.value.push(o.meta.uniqueIndex);
      }
    },
    clearExpandingItemIndexList: () => {
      n.value = [];
    }
  };
}
function Jn(e) {
  const t = x(() => e.value.filter((l) => l.fixed)), a = x(() => t.value.length ? t.value[t.value.length - 1].value : ""), n = x(() => {
    if (!t.value.length)
      return [];
    const l = t.value.map((r) => r.width ?? 100);
    return t.value.map((r, p) => ({
      value: r.value,
      fixed: r.fixed ?? !0,
      width: r.width ?? 100,
      distance: p === 0 ? 0 : l.reduce((o, i, c) => {
        let C = o;
        return c < p && (C += i), C;
      })
    }));
  });
  return {
    fixedHeaders: t,
    lastFixedColumn: a,
    fixedColumnsInfos: n
  };
}
function Qn(e, t, a, n, l, r, p, o, i, c, C, N, k, f, w, M, Y, y, P, B, D) {
  const U = q([]), W = q([]);
  te(i, (d) => {
    W.value = d.map((m) => ({
      ...m,
      sortable: m.sortable ?? !1,
      visible: m.visible ?? !0,
      fixed: m.fixed ?? !1,
      groupable: m.groupable ?? !1,
      grouped: m.grouped ?? !1,
      hideOnGroup: m.hideOnGroup ?? !0
    }));
  }, {
    immediate: !0
  });
  const G = x(() => W.value.filter((d) => d.visible));
  te(G, (d) => {
    e.value = d, t.value && (a.value = d.map((m) => m.value));
  }, {
    immediate: !0
  });
  const Z = x(() => t.value ? G.value.filter((d) => a.value.includes(d.value)) : G.value), J = x(() => Z.value.findIndex((d) => d.fixed) !== -1), O = x(() => J.value ? Z.value.filter((d) => d.fixed) : []), he = x(() => Z.value.filter((d) => !d.fixed)), I = q(((d, m) => Array.isArray(d) && Array.isArray(m) ? {
    sortBy: d,
    sortDesc: m.map((R) => R === "desc")
  } : d !== "" ? {
    sortBy: M.value,
    sortDesc: Y.value === "desc"
  } : null)(M.value, Y.value)), be = x(() => {
    const m = [
      ...O.value,
      ...he.value
    ].map((L) => {
      const j = Object.assign(L);
      if (j.sortable && (j.sortType = "none"), f.value)
        if (Array.isArray(f.value.sortBy) && Array.isArray(f.value.sortType) && f.value.sortBy.includes(j.value)) {
          const Ae = f.value.sortBy.indexOf(j.value);
          j.sortType = f.value.sortType[Ae];
        } else
          j.value === f.value.sortBy && f.value.sortType && (j.sortType = f.value.sortType);
      if (I.value && Array.isArray(I.value.sortBy) && Array.isArray(I.value.sortDesc) && I.value.sortBy.includes(j.value)) {
        const Ae = I.value.sortBy.indexOf(j.value);
        j.sortType = I.value.sortDesc[Ae] ? "desc" : "asc";
      } else
        I.value && j.value === I.value.sortBy && (j.sortType = I.value.sortDesc ? "desc" : "asc");
      return j;
    });
    let R = [];
    c.value ? R = [p.value || J.value ? {
      text: "",
      value: "expand",
      fixed: !0,
      width: l.value
    } : { text: "", value: "expand" }, ...m] : R = m;
    let V = [];
    w.value ? V = [o.value || J.value ? {
      text: "#",
      value: "index",
      fixed: !0,
      width: C.value
    } : { text: "#", value: "index" }, ...R] : V = R;
    let H = [], ae = null;
    return P.value && (ae = r.value || J.value ? {
      text: "checkbox",
      value: "checkbox",
      fixed: !0,
      width: n.value ?? 70
    } : { text: "checkbox", value: "checkbox" }, H.push(ae)), H = [...H, ...V], H.filter((L) => L.grouped && !L.hideOnGroup ? !0 : !L.groupable || !L.grouped);
  }), Le = x(() => be.value.map((d) => d.value)), g = (d) => {
    let m = null;
    return d === "none" ? m = "asc" : d === "asc" ? m = "desc" : m = k.value ? "asc" : null, m;
  }, b = (d) => {
    const m = d.value, R = g(d.sortType);
    if (N.value && B(m, R), I.value && Array.isArray(I.value.sortBy) && Array.isArray(I.value.sortDesc)) {
      const V = I.value.sortBy.indexOf(m);
      V === -1 ? R !== null && (I.value.sortBy.push(m), I.value.sortDesc.push(R === "desc")) : R === null ? (I.value.sortDesc.splice(V, 1), I.value.sortBy.splice(V, 1)) : I.value.sortDesc[V] = R === "desc";
    } else
      R === null ? I.value = null : I.value = {
        sortBy: m,
        sortDesc: R === "desc"
      };
    D("updateSort", {
      sortType: R,
      sortBy: m
    });
  }, S = x(() => {
    if (!I.value)
      return null;
    if (Array.isArray(I.value.sortBy) && Array.isArray(I.value.sortDesc)) {
      if (!t.value)
        return I.value;
      const d = I.value.sortBy.reduce((V, H, ae) => {
        const L = Boolean(U.value.find((j) => j.value === H));
        return !Le.value.includes(H) && !L && V.push(ae), V;
      }, []), m = I.value.sortBy.filter((V, H) => !d.includes(H)), R = I.value.sortDesc.filter((V, H) => !d.includes(H));
      return {
        sortBy: m,
        sortDesc: R
      };
    }
    return I.value;
  });
  return {
    initialHeaders: W,
    groupedHeaders: U,
    filteredClientSortOptions: S,
    headerColumns: Le,
    headersForRender: be,
    updateSortField: b,
    isMultiSorting: (d) => f.value && Array.isArray(f.value.sortBy) ? f.value.sortBy.includes(d) : S.value && Array.isArray(S.value.sortBy) ? S.value.sortBy.includes(d) : !1,
    getMultiSortNumber: (d) => f.value && Array.isArray(f.value.sortBy) ? f.value.sortBy.indexOf(d) + 1 : S.value && Array.isArray(S.value.sortBy) ? S.value.sortBy.indexOf(d) + 1 : !1,
    getNewSortType: g
  };
}
function es(e, t, a, n, l, r, p, o) {
  const i = x(() => (e.value - 1) * n.value + 1), c = x(() => t.value ? Math.min(o.value, e.value * n.value) : Math.min(
    p.value.length,
    e.value * n.value
  )), C = x(() => t.value ? a.value : p.value.slice(i.value - 1, c.value)), N = x(() => (r.value && C.value.forEach((f, w) => {
    f.index = i.value + w;
  }), C.value)), k = x(() => l.value.length ? l.value.length === p.value.length ? "allSelected" : "partSelected" : "noneSelected");
  return {
    currentPageFirstIndex: i,
    currentPageLastIndex: c,
    multipleSelectStatus: k,
    pageRows: N
  };
}
function ts(e, t, a, n, l, r, p) {
  const o = q(r.value ? r.value.page : e.value), i = x(() => Math.ceil(n.value / l.value)), c = x(() => i.value === 0 || o.value === i.value), C = x(() => o.value === 1);
  return {
    currentPaginationNumber: o,
    maxPaginationNumber: i,
    isLastPage: c,
    isFirstPage: C,
    firstPage: () => {
      !n.value || a.value || (t.value ? p(1) : o.value = 1);
    },
    lastPage: () => {
      !n.value || a.value || (t.value ? p(i.value) : o.value = i.value);
    },
    nextPage: () => {
      if (n.value && !c.value && !a.value)
        if (t.value) {
          const y = o.value + 1;
          p(y);
        } else
          o.value += 1;
    },
    prevPage: () => {
      if (n.value && !C.value && !a.value)
        if (t.value) {
          const y = o.value - 1;
          p(y);
        } else
          o.value -= 1;
    },
    updatePage: (y) => {
      a.value || (t.value ? p(y) : o.value = y);
    },
    updateCurrentPaginationNumber: (y) => {
      o.value = y;
    }
  };
}
let je;
const as = new Uint8Array(16);
function ns() {
  if (!je && (je = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto), !je))
    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return je(as);
}
const K = [];
for (let e = 0; e < 256; ++e)
  K.push((e + 256).toString(16).slice(1));
function ss(e, t = 0) {
  return (K[e[t + 0]] + K[e[t + 1]] + K[e[t + 2]] + K[e[t + 3]] + "-" + K[e[t + 4]] + K[e[t + 5]] + "-" + K[e[t + 6]] + K[e[t + 7]] + "-" + K[e[t + 8]] + K[e[t + 9]] + "-" + K[e[t + 10]] + K[e[t + 11]] + K[e[t + 12]] + K[e[t + 13]] + K[e[t + 14]] + K[e[t + 15]]).toLowerCase();
}
const ls = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), Et = {
  randomUUID: ls
};
function is(e, t, a) {
  if (Et.randomUUID && !t && !e)
    return Et.randomUUID();
  e = e || {};
  const n = e.random || (e.rng || ns)();
  if (n[6] = n[6] & 15 | 64, n[8] = n[8] & 63 | 128, t) {
    a = a || 0;
    for (let l = 0; l < 16; ++l)
      t[a + l] = n[l];
    return t;
  }
  return ss(n);
}
const Ie = 2, rs = 1, oe = 0, Ke = {
  SINGLE: "single",
  MULTIPLE: "multi"
};
function os(e, t, a, n, l) {
  const r = q([]), p = (k, f = 0) => k.map(({ _children: w, _showChildren: M, ...Y }, y) => {
    const P = Array.isArray(w) && w.length ? p(w, f + Ie) : [];
    return {
      ...Y,
      meta: {
        selected: !1,
        uniqueIndex: is(),
        isExactMatch: !1,
        groupParent: f,
        children: P,
        initialChildren: P,
        showChildren: M || !1,
        index: y,
        originalIndex: y,
        exactMatchColumns: []
      }
    };
  });
  te(e, (k) => {
    r.value = p(k);
  }, {
    immediate: !0
  });
  const o = x(() => r.value.some((k) => k.meta.children.length)), i = x(() => !t.value && a.value.findIndex((k) => k === l.value) === -1 ? [l.value, ...a.value] : a.value), c = q(n.value ? n.value.rowsPerPage : l.value);
  return {
    initialRows: r,
    rowsItemsComputed: i,
    rowsPerPageRef: c,
    rowsHaveChildren: o,
    updateRowsPerPage: (k) => {
      c.value = k;
    },
    toggleChildrenVisibility: (k, f) => {
      k.stopPropagation(), f.meta.showChildren = !f.meta.showChildren;
    }
  };
}
function us(e, t, a) {
  const n = x({
    get: () => {
      if (e.value) {
        const {
          page: o,
          rowsPerPage: i,
          sortBy: c,
          sortType: C
        } = e.value;
        return {
          page: o,
          rowsPerPage: i,
          sortBy: c ?? null,
          sortType: C ?? null
        };
      }
      return null;
    },
    set: (o) => {
      a("update:serverOptions", o);
    }
  });
  return {
    serverOptionsComputed: n,
    updateServerOptionsPage: (o) => {
      n.value && (n.value = {
        ...n.value,
        page: o
      });
    },
    updateServerOptionsSort: (o, i) => {
      if (n.value)
        if (t.value && Array.isArray(n.value.sortBy) && Array.isArray(n.value.sortType)) {
          const c = n.value.sortBy.findIndex((C) => C === o);
          c === -1 && i !== null && (n.value.sortBy.push(o), n.value.sortType.push(i)), i === null ? (n.value.sortBy.splice(c, 1), n.value.sortType.splice(c, 1)) : n.value.sortType[c] = i;
        } else
          n.value = {
            ...n.value,
            sortBy: i !== null ? o : null,
            sortType: i
          };
    },
    updateServerOptionsRowsPerPage: (o) => {
      n.value && (n.value = {
        ...n.value,
        page: 1,
        rowsPerPage: o
      });
    }
  };
}
function fe(e, t) {
  if (e.includes(".")) {
    let a = "";
    const n = e.split("."), { length: l } = n;
    let r = 0;
    for (; r < l && (a = r === 0 ? t[n[r]] : a[n[r]], r += 1, a !== void 0); )
      ;
    return a;
  }
  return t[e];
}
function cs(e, t) {
  const a = fe(e, t);
  return Array.isArray(a) ? a.join(",") : a;
}
function Kt(e) {
  return typeof e == "object" && !Array.isArray(e) && e !== null;
}
function Xe(e, t = null, a = {}) {
  if (typeof e != "object")
    return a;
  const n = Object.keys(e);
  return n.length && n.forEach((l) => {
    const r = t ? `${t}.${l}` : l;
    typeof e[l] == "object" ? Xe(e[l], r, a) : a[r] = e[l];
  }), a;
}
function ze(e, t = []) {
  if (!Kt(e) || !Array.isArray(t) || !t.length)
    return e;
  const a = Object.keys(e);
  return a.length ? a.filter((n) => !t.includes(n)).reduce((n, l) => (n[l] = e[l], n), {}) : e;
}
function Ht(e) {
  if (!Kt(e))
    return e;
  const t = Object.keys(e);
  if (!t.length)
    return e;
  const a = {};
  return t.forEach((n) => {
    const l = n.split(".");
    l.reduce((r, p, o) => r[p] ? r[p] : Number.isNaN(Number(l[o + 1])) ? (r[p] = l.length - 1 === o ? e[n] : {}, r[p]) : (r[p] = [], r[p]), a);
  }), a;
}
function ds(e) {
  return new Function(`return ${e}`)();
}
function ps(e, t) {
  const a = /{([^{]+)}/g;
  return e.replace(a, (n, l) => {
    if (l.includes(">") && l.includes("?") && l.includes(":")) {
      const r = l.split(" ");
      return r[0] = t[r[0]], ds(r.join(" "));
    }
    return l = t[l], l === null ? "" : l;
  });
}
function Ft(e) {
  return Boolean(Date.parse(e));
}
function fs(e, t, a, n, l, r, p, o, i, c, C, N, k, f, w) {
  const M = q([]), Y = ["expand", "index", "checkbox", "meta"], y = (g) => {
    const b = ze(g, Y), S = Xe(b), A = e.value ? Object.keys(S).filter(
      (d) => !t.value.includes(d)
    ) : [];
    if (typeof C.value == "string" && C.value !== "") {
      const d = Ht(ze(S, A));
      return fe(C.value, d);
    }
    if (Array.isArray(C.value)) {
      const d = Ht(ze(S, A));
      let m = "";
      return C.value.forEach((R) => {
        m += fe(R, d);
      }), m;
    }
    const T = ze(S, A);
    return Object.values(T).join(" ");
  }, P = (g) => {
    const b = /* @__PURE__ */ new Map();
    let S = oe;
    g.forEach((T, d) => {
      let m = d;
      T.meta.isExactMatch && (m = S, S += 1), b.set(T, {
        index: m,
        exactMatch: T.meta.isExactMatch
      });
    });
    let A = S;
    b.forEach((T) => {
      T.exactMatch || (T.index = A, A += 1);
    }), g.forEach((T) => {
      if (b.has(T)) {
        const { index: d } = b.get(T);
        T.meta.index = d;
      }
    });
  }, B = (g) => {
    g.length && (g.forEach((b) => {
      b.meta.exactMatchColumns = [];
      const S = Xe(ze(b, Y));
      Object.keys(S).forEach((T) => {
        (n.value ? S[T].toString() === N.value : S[T].toString().toLowerCase() === N.value.toLowerCase()) && b.meta.exactMatchColumns.push(T);
      }), b.meta.isExactMatch = Boolean(b.meta.exactMatchColumns.length), B(b.meta.children);
    }), P(g));
  }, D = x(() => N.value !== ""), U = (g) => (g.meta.children = g.meta.initialChildren.filter(U), D.value ? (g.meta.children.length && (g.meta.showChildren = !0), new RegExp(N.value, "i").test(y(g)) || g.meta.children.length) : !0), W = x(() => i.value ? c.value : c.value.filter(U)), G = x(() => {
    let g = [...W.value];
    return o.value ? (o.value.forEach((b) => {
      g = g.filter((S) => {
        const { field: A, comparison: T, criteria: d } = b;
        if (typeof T == "function")
          return T(fe(A, S), d);
        const m = fe(A, S);
        switch (T) {
          case "=":
            return m === d;
          case "!=":
            return m !== d;
          case ">":
            return m > d;
          case "<":
            return m < d;
          case "<=":
            return m <= d;
          case ">=":
            return m >= d;
          case "between":
            return m >= Math.min(...d) && m <= Math.max(...d);
          default:
            return m === d;
        }
      });
    }), g) : W.value;
  }), Z = (g) => g.length ? (g.forEach((b) => {
    Z(b.meta.children);
  }), g.sort((b, S) => b.meta.index - S.meta.index)) : g, J = (g, b, S, A) => {
    const T = g[A];
    b[A];
    const d = (A === oe ? S : J(g, b, S, A - 1)).sort((m, R) => {
      let V = !0;
      for (let H = oe; H < A; H += 1)
        if (fe(g[H], m) !== fe(g[H], R)) {
          V = !1;
          break;
        }
      if (V) {
        const H = b[A] ? -1 : 1, ae = fe(T, m), L = fe(T, R);
        return ae < L ? -H : ae > L ? H : typeof ae == "string" && typeof L == "string" ? Ft(ae) && Ft(L) ? H > oe ? new Date(ae).getTime() - new Date(L).getTime() : new Date(L).getTime() - new Date(ae).getTime() : H * ae.localeCompare(L) : oe;
      }
      return oe;
    });
    return d.filter((m) => m.meta.children.length).forEach((m) => {
      m.meta.children = J(g, b, m.meta.children, A);
    }), d;
  }, O = x(() => {
    const g = i.value ? c.value : G.value;
    if (D.value && a.value && B(g), Z(g), i.value || p.value === null)
      return g;
    const { sortBy: b, sortDesc: S } = p.value, A = [...g];
    return f && Array.isArray(b) && Array.isArray(S) ? b.length ? J(b, S, A, b.length - 1) : A : l.value.includes(b) ? J([b], [S], A, oe) : A;
  }), he = x(() => i.value ? k.value : O.value.length), Te = (g) => {
    g.length && g.forEach((b) => {
      b.meta.exactMatchColumns = [], b.meta.index !== b.meta.originalIndex && (b.meta.index = b.meta.originalIndex), Te(b.meta.children);
    });
  };
  te(N, () => {
    Te(c.value);
  }), te(G, (g) => {
    o.value && w("updateFilter", g);
  }, { immediate: !0, deep: !0 }), te(M, (g) => {
    w("update:selectedRows", g);
  }, {
    deep: !0
  });
  const I = (g, b) => {
    g.length && g.forEach((S) => {
      S.meta.selected = b, S.meta.children.length && I(S.meta.children, b);
    });
  };
  return {
    totalRows: O,
    selectedRows: M,
    totalRowsLength: he,
    toggleSelectAll: (g) => {
      if (r.value) {
        if (I(O.value, g), !g) {
          M.value = [];
          return;
        }
        M.value = O.value;
      }
    },
    toggleSelectRow: (g) => {
      const b = g.meta.selected;
      if (g.meta.selected = !g.meta.selected, b)
        M.value = M.value.filter((S) => g.meta.uniqueIndex !== S.meta.uniqueIndex);
      else if (!r.value && M.value.length === 1)
        M.value[0].meta.selected = !1, M.value = [g];
      else {
        const S = M.value;
        S.unshift(g), M.value = S;
      }
    }
  };
}
function vs() {
  const e = q([]), t = q([]), a = q(!1);
  return {
    tableProperties: e,
    isManageTablePropertiesVisible: a,
    checkedTableProperties: t,
    setCheckedTableProperties: (r) => {
      t.value = r;
    },
    toggleManageTablePropertiesVisibility: () => {
      a.value = !a.value;
    }
  };
}
function gs(e, t, a) {
  const n = q([]), l = q(oe), r = q({}), p = (y) => {
    y.grouped = !0, a.value.push(y);
  }, o = (y) => {
    y.grouped = !1, a.value = a.value.filter((P) => P.value !== y.value);
  }, i = (y, P) => {
    y.length && y.forEach((B) => {
      const D = B.meta.groupParent < P ? P : B.meta.groupParent;
      r.value[B.meta.uniqueIndex] = D + Ie, B.meta.children.length && i(B.meta.children, D + Ie);
    });
  }, c = (y, P, B, D) => {
    const U = y.reduce((W, G) => {
      const Z = Xe(G), J = Boolean(G.meta.children.length);
      let O = 0;
      return D && (O = B + Ie, r.value[G.meta.uniqueIndex] = B + Ie, l.value = O), J && i(G.meta.children, O), (W[Z[P.value]] = W[Z[P.value]] || []).push(G), W;
    }, {});
    return Object.keys(U).map((W) => ({
      groupBy: P.groupBy instanceof Function ? P.groupBy : null,
      groupHeader: P,
      groupKey: W,
      meta: {
        groupParent: B,
        children: U[W],
        showChildren: !0,
        isGroup: !0
      }
    })).sort((W, G) => {
      const Z = P.sortType === "desc" ? -1 : 1, J = W.groupKey, O = G.groupKey;
      return J < O ? -Z : J > O ? Z : 0;
    });
  }, C = (y, P, B, D) => a.value.length === P ? y : (y.forEach((U) => {
    U.meta.children = c(
      U.meta.children,
      a.value[P],
      B,
      D
    ), C(
      U.meta.children,
      P + 1,
      B + 1,
      D
    );
  }), null), N = (y) => {
    y.length && y.forEach((P) => {
      P.groupBy instanceof Function && (P.groupKey = ps(
        P.groupBy(P.groupKey),
        {
          rowsLength: P.meta.children.length
        }
      )), N(P.meta.children || []);
    });
  };
  te(e, (y) => {
    const P = y.filter((B) => B.groupable && B.grouped);
    P.length && (a.value = P);
  }, {
    immediate: !0
  }), te(a, (y) => {
    y.length || (r.value = {}, l.value = oe, t.value.forEach((P) => {
      P.meta.groupParent = oe;
    }));
  }), _a(() => {
    if (a.value.length) {
      const y = t.value.some((B) => B.meta.children.length), P = c(t.value, a.value[oe], rs, y);
      a.value.length > 1 && C(P, 1, Ie, y), N(P), n.value = P;
    }
  });
  const k = x(() => a.value.length ? n.value : t.value), f = (y) => y.reduce((P, B) => {
    var U;
    const D = B.meta.showChildren && ((U = B.meta.children) != null && U.length) ? f(B.meta.children) : [];
    return P.concat([
      B,
      ...D
    ]);
  }, []), w = x(() => f(k.value)), M = x(() => w.value.filter((y) => !y.meta.isGroup));
  return {
    groupParentDictionary: r,
    multipleCheckboxShift: l,
    flattenedRows: w,
    flattenedNonGroupedRows: M,
    group: p,
    ungroup: o,
    toggleGroupChildrenVisibility: (y) => {
      y.meta.showChildren = !y.meta.showChildren;
    }
  };
}
const ms = {
  alternating: {
    type: Boolean,
    default: !1
  },
  buttonsPagination: {
    type: Boolean,
    default: !1
  },
  paginationWithInput: {
    type: Boolean,
    default: !1
  },
  hasCheckboxColumn: {
    type: Boolean,
    default: !0
  },
  checkboxColumnWidth: {
    type: Number,
    default: null
  },
  currentPage: {
    type: Number,
    default: 1
  },
  emptyMessage: {
    type: String,
    default: "No Available Data"
  },
  expandColumnWidth: {
    type: Number,
    default: 36
  },
  filterOptions: {
    type: Array,
    default: null
  },
  fixedExpand: {
    type: Boolean,
    default: !1
  },
  fixedHeader: {
    type: Boolean,
    default: !0
  },
  fixedCheckbox: {
    type: Boolean,
    default: !1
  },
  fixedIndex: {
    type: Boolean,
    default: !1
  },
  headerTextDirection: {
    type: String,
    default: "left"
  },
  bodyTextDirection: {
    type: String,
    default: "left"
  },
  hideFooter: {
    type: Boolean,
    default: !1
  },
  hideRowsPerPage: {
    type: Boolean,
    default: !1
  },
  hideHeader: {
    type: Boolean,
    default: !1
  },
  indexColumnWidth: {
    type: Number,
    default: 60
  },
  loading: {
    type: Boolean,
    default: !1
  },
  rowsPerPage: {
    type: Number,
    default: 25
  },
  rowsItems: {
    type: Array,
    default: () => [25, 50, 100]
  },
  rowsPerPageMessage: {
    type: String,
    default: "rows per page:"
  },
  searchField: {
    type: [String, Array],
    default: ""
  },
  searchValue: {
    type: String,
    default: ""
  },
  serverOptions: {
    type: Object,
    default: null
  },
  serverItemsLength: {
    type: Number,
    default: 0
  },
  showIndex: {
    type: Boolean,
    default: !1
  },
  sortBy: {
    type: [String, Array],
    default: ""
  },
  sortType: {
    type: [String, Array],
    default: "asc"
  },
  multiSort: {
    type: Boolean,
    default: !1
  },
  tableMinHeight: {
    type: Number,
    default: 180
  },
  tableHeight: {
    type: Number,
    default: null
  },
  themeColor: {
    type: String,
    default: "#42b883"
  },
  tableClassName: {
    type: String,
    default: ""
  },
  headerClassName: {
    type: String,
    default: ""
  },
  headerItemClassName: {
    type: [Function, String],
    default: ""
  },
  bodyRowClassName: {
    type: [Function, String],
    default: ""
  },
  bodyExpandRowClassName: {
    type: [Function, String],
    default: ""
  },
  bodyItemClassName: {
    type: [Function, String],
    default: ""
  },
  noHover: {
    type: Boolean,
    default: !1
  },
  borderCell: {
    type: Boolean,
    default: !1
  },
  mustSort: {
    type: Boolean,
    default: !1
  },
  rowsOfPageSeparatorMessage: {
    type: String,
    default: "of"
  },
  clickEventType: {
    type: String,
    default: "single"
  },
  clickRowToExpand: {
    type: Boolean,
    default: !1
  },
  selectable: {
    type: String,
    validator(e) {
      return [
        Ke.SINGLE,
        Ke.MULTIPLE
      ].includes(e);
    },
    default: Ke.SINGLE
  },
  exactMatch: {
    type: Boolean,
    default: !1
  },
  isExactMatchCaseSensitive: {
    type: Boolean,
    default: !1
  },
  manageTableProperties: {
    type: Boolean,
    default: !1
  },
  manageTablePropertiesLabel: {
    type: String,
    default: "Properties"
  },
  columnsResizable: {
    type: Boolean,
    default: !1
  }
}, ys = (e) => (we("data-v-b0b5f14c"), e = e(), Be(), e), hs = {
  key: 0,
  class: "manage-table-properties-container"
}, bs = { class: "area" }, xs = {
  key: 0,
  class: "checkbox-container"
}, _s = ["onClick"], Ps = {
  key: 2,
  class: "header-text"
}, Cs = {
  key: 4,
  class: "multi-sort__number"
}, ks = { key: 0 }, Ss = { class: "group-column" }, Ns = ["onClick"], $s = ["onClick", "onDblclick"], Is = ["data-test-id", "onClick"], ws = {
  key: 3,
  class: "checkbox-container"
}, Bs = ["colspan"], Ts = {
  key: 0,
  class: "vue3-easy-data-table__loading"
}, Ls = /* @__PURE__ */ ys(() => /* @__PURE__ */ $("div", { class: "vue3-easy-data-table__loading-mask" }, null, -1)), As = { class: "loading-entity" }, Ms = {
  key: 1,
  class: "vue3-easy-data-table__message"
}, Rs = {
  key: 0,
  class: "vue3-easy-data-table__footer"
}, Es = {
  key: 0,
  class: "pagination__rows-per-page"
}, Hs = { class: "pagination__items-index" }, Fs = {
  key: 0,
  "data-test-id": "pagination-with-input-text"
}, qs = {
  key: 1,
  "data-test-id": "buttons-pagination-text"
}, zs = /* @__PURE__ */ ne({
  props: {
    ...ms,
    items: {
      type: Array,
      required: !0
    },
    headers: {
      type: Array,
      required: !0
    }
  },
  emits: [
    "clickRow",
    "expandRow",
    "updateSort",
    "updateFilter",
    "update:selectedRows",
    "update:serverOptions"
  ],
  setup(e, { expose: t, emit: a }) {
    const n = e;
    Se((_) => ({
      "0f1049e4": s(ae),
      "08c526e8": s(H)
    }));
    const {
      clickEventType: l,
      bodyTextDirection: r,
      checkboxColumnWidth: p,
      currentPage: o,
      expandColumnWidth: i,
      filterOptions: c,
      fixedCheckbox: C,
      fixedExpand: N,
      fixedHeader: k,
      fixedIndex: f,
      headers: w,
      headerTextDirection: M,
      indexColumnWidth: Y,
      items: y,
      loading: P,
      mustSort: B,
      multiSort: D,
      rowsItems: U,
      rowsPerPage: W,
      searchField: G,
      searchValue: Z,
      serverItemsLength: J,
      serverOptions: O,
      showIndex: he,
      sortBy: Te,
      sortType: I,
      tableHeight: be,
      tableMinHeight: Le,
      themeColor: g,
      rowsOfPageSeparatorMessage: b,
      selectable: S,
      exactMatch: A,
      isExactMatchCaseSensitive: T,
      manageTableProperties: d,
      hasCheckboxColumn: m,
      manageTablePropertiesLabel: R
    } = Ot(n), V = q(w.value), H = x(() => be.value ? `${be.value}px` : null), ae = x(() => `${Le.value}px`);
    Lt("themeColor", g.value);
    const L = Dt(), j = x(() => !!L.pagination), Ae = x(() => !!L.loading), it = x(() => !!L.expand), Xt = x(() => !!L.body), rt = q(), Je = q();
    Lt("dataTable", rt);
    const ot = q(!1);
    nt(() => {
      Je.value.addEventListener("scroll", () => {
        ot.value = Je.value.scrollLeft > 0;
      });
    });
    const xe = x(() => O.value !== null), ut = x(() => S.value === Ke.MULTIPLE), {
      serverOptionsComputed: Qe,
      updateServerOptionsPage: Yt,
      updateServerOptionsSort: Zt,
      updateServerOptionsRowsPerPage: Jt
    } = us(
      O,
      D,
      a
    ), {
      tableProperties: ct,
      isManageTablePropertiesVisible: Qt,
      checkedTableProperties: Me,
      toggleManageTablePropertiesVisibility: dt,
      setCheckedTableProperties: ea
    } = vs(), {
      initialHeaders: ta,
      groupedHeaders: aa,
      filteredClientSortOptions: pt,
      headerColumns: et,
      headersForRender: _e,
      updateSortField: ft,
      isMultiSorting: na,
      getMultiSortNumber: sa
    } = Qn(
      ct,
      d,
      Me,
      p,
      i,
      C,
      N,
      f,
      V,
      it,
      Y,
      xe,
      B,
      Qe,
      he,
      Te,
      I,
      D,
      m,
      Zt,
      a
    ), {
      initialRows: vt,
      rowsItemsComputed: gt,
      rowsPerPageRef: ge,
      rowsHaveChildren: Oe,
      updateRowsPerPage: la,
      toggleChildrenVisibility: ia
    } = os(
      y,
      xe,
      U,
      O,
      W
    ), {
      totalRows: ra,
      selectedRows: mt,
      totalRowsLength: Ve,
      toggleSelectAll: oa,
      toggleSelectRow: ua
    } = fs(
      d,
      Me,
      A,
      T,
      et,
      ut,
      pt,
      c,
      xe,
      vt,
      G,
      Z,
      J,
      D,
      a
    ), {
      currentPaginationNumber: ie,
      maxPaginationNumber: Pe,
      isLastPage: Re,
      isFirstPage: Ee,
      firstPage: yt,
      nextPage: He,
      prevPage: Fe,
      lastPage: ht,
      updatePage: Ne,
      updateCurrentPaginationNumber: ca
    } = ts(
      o,
      xe,
      P,
      Ve,
      ge,
      O,
      Yt
    ), {
      currentPageFirstIndex: bt,
      currentPageLastIndex: xt,
      multipleSelectStatus: _t,
      pageRows: qe
    } = es(
      ie,
      xe,
      vt,
      ge,
      mt,
      he,
      ra,
      Ve
    ), {
      groupParentDictionary: Pt,
      multipleCheckboxShift: Ct,
      flattenedRows: da,
      flattenedNonGroupedRows: kt,
      group: pa,
      ungroup: fa,
      toggleGroupChildrenVisibility: va
    } = gs(
      ta,
      qe,
      aa
    ), tt = x(() => ie.value === 0 ? 0 : (ie.value - 1) * ge.value), {
      expandingRowIndexList: St,
      updateExpandingItemIndexList: Nt,
      clearExpandingItemIndexList: $t
    } = Zn(
      kt,
      tt,
      a
    ), {
      fixedHeaders: ga,
      lastFixedColumn: It,
      fixedColumnsInfos: ma
    } = Jn(
      _e
    ), {
      clickRow: wt
    } = Yn(
      ut,
      kt,
      mt,
      l,
      he,
      a
    ), ya = (_) => {
      const se = _.width ?? (_.fixed ? 100 : null);
      if (se)
        return `width: ${se}px; min-width: ${se}px;`;
    }, Bt = (_, se = "th") => {
      if (!ga.value.length)
        return;
      const u = ma.value.find((Q) => Q.value === _);
      if (u)
        return `left: ${u.distance}px;z-index: ${se === "th" ? 3 : 1};position: sticky;`;
    };
    return te(P, (_, se) => {
      Qe.value && _ === !1 && se === !0 && (ca(Qe.value.page), $t());
    }), te(ge, (_) => {
      xe.value ? Jt(_) : Ne(1);
    }), te(Z, () => {
      xe.value || Ne(1);
    }), te([ie, pt, G, Z, c], () => {
      $t();
    }, { deep: !0 }), t({
      currentPageFirstIndex: bt,
      currentPageLastIndex: xt,
      clientRowsLength: Ve,
      maxPaginationNumber: Pe,
      currentPaginationNumber: ie,
      isLastPage: Re,
      isFirstPage: Ee,
      firstPage: yt,
      nextPage: He,
      prevPage: Fe,
      lastPage: ht,
      updatePage: Ne,
      rowsPerPageOptions: gt,
      rowsPerPageActiveOption: ge,
      updateRowsPerPageActiveOption: la,
      ...{}
    }), (_, se) => (v(), h("div", null, [
      s(d) ? (v(), h("div", hs, [
        $("div", bs, [
          le(re, {
            class: "sliders-icon",
            icon: "sliders-h",
            "data-test-id": "manage-table-properties-icon",
            onClick: De(s(dt), ["stop"])
          }, null, 8, ["onClick"]),
          s(Qt) ? (v(), de(Xn, {
            key: 0,
            modelValue: s(Me),
            "onUpdate:modelValue": se[0] || (se[0] = (u) => At(Me) ? Me.value = u : null),
            "data-test-id": "manage-table-properties",
            columns: s(ct),
            label: s(R),
            onSetCheckedTableProperties: s(ea),
            onClose: s(dt)
          }, null, 8, ["modelValue", "columns", "label", "onSetCheckedTableProperties", "onClose"])) : z("", !0)
        ])
      ])) : z("", !0),
      $("div", {
        ref_key: "dataTable",
        ref: rt,
        class: F(["vue3-easy-data-table", [_.tableClassName]])
      }, [
        $("div", {
          ref_key: "tableBody",
          ref: Je,
          class: F(["vue3-easy-data-table__main", {
            "fixed-header": s(k),
            "fixed-height": s(be),
            "show-shadow": ot.value,
            hoverable: !_.noHover,
            "border-cell": _.borderCell
          }])
        }, [
          $("table", null, [
            $("colgroup", null, [
              (v(!0), h(ue, null, Ce(s(_e), (u, Q) => (v(), h("col", {
                key: Q,
                style: me(ya(u))
              }, null, 4))), 128))
            ]),
            s(_e).length && !_.hideHeader ? (v(), h("thead", {
              key: 0,
              class: F(["vue3-easy-data-table__header", [_.headerClassName]])
            }, [
              $("tr", null, [
                (v(!0), h(ue, null, Ce(s(_e), (u, Q) => (v(), h("th", {
                  key: Q,
                  "data-test-id": "table-header-item",
                  class: F([{
                    sortable: u.sortable,
                    none: u.sortable && u.sortType === "none",
                    desc: u.sortable && u.sortType === "desc",
                    asc: u.sortable && u.sortType === "asc",
                    shadow: u.value === s(It),
                    resizable: _.columnsResizable
                    // eslint-disable-next-line max-len
                  }, typeof _.headerItemClassName == "string" ? _.headerItemClassName : _.headerItemClassName(u, Q)]),
                  style: me([
                    Bt(u.value),
                    u.text === "checkbox" && !Q && s(Ct) && { "padding-left": `${s(Ct)}rem` }
                  ])
                }, [
                  u.text === "checkbox" ? (v(), h("div", xs, [
                    s(Oe) ? (v(), de(re, {
                      key: 0,
                      class: "expand-children-icon",
                      icon: "plus-square",
                      style: { visibility: "hidden" }
                    })) : z("", !0),
                    (v(), de(Ia, {
                      key: s(_t),
                      status: s(_t),
                      class: F({ "has-children": s(Oe) }),
                      onChange: s(oa)
                    }, null, 8, ["status", "class", "onChange"]))
                  ])) : (v(), h("span", {
                    key: 1,
                    class: F(["header", `direction-${s(M)}`]),
                    onClick: (E) => u.sortable && u.sortType && s(ft)(u)
                  }, [
                    s(L)[`header-${u.value}`] ? ee(_.$slots, `header-${u.value}`, pe($e({ key: 0 }, u)), void 0, !0) : s(L)[`header-${u.value.toLowerCase()}`] ? ee(_.$slots, `header-${u.value.toLowerCase()}`, pe($e({ key: 1 }, u)), void 0, !0) : (v(), h("span", Ps, X(u.text), 1)),
                    u.sortable ? (v(), h("i", {
                      key: u.sortType ? u.sortType : "none",
                      class: F(["sortType-icon", { desc: u.sortType === "desc" }])
                    }, null, 2)) : z("", !0),
                    s(D) && s(na)(u.value) ? (v(), h("span", Cs, X(s(sa)(u.value)), 1)) : z("", !0),
                    u.groupable && !u.grouped ? (v(), de(re, {
                      key: 5,
                      class: "group-icon",
                      icon: "stream",
                      onClick: De((E) => s(pa)(u), ["stop"])
                    }, null, 8, ["onClick"])) : z("", !0)
                  ], 10, _s))
                ], 6))), 128))
              ])
            ], 2)) : z("", !0),
            s(Xt) ? ee(_.$slots, "body", pe($e({ key: 1 }, s(qe))), void 0, !0) : s(et).length ? (v(), h("tbody", {
              key: 2,
              class: F(["vue3-easy-data-table__body", { "row-alternation": _.alternating }])
            }, [
              ee(_.$slots, "body-prepend", pe(at({
                rows: s(qe),
                pagination: {
                  isFirstPage: s(Ee),
                  isLastPage: s(Re),
                  currentPaginationNumber: s(ie),
                  maxPaginationNumber: s(Pe),
                  nextPage: s(He),
                  prevPage: s(Fe)
                },
                headers: s(_e)
              })), void 0, !0),
              (v(!0), h(ue, null, Ce(s(da), (u, Q) => (v(), h(ue, { key: Q }, [
                u.groupHeader ? (v(), h("tr", ks, [
                  $("td", {
                    colspan: "100%",
                    style: me({ "padding-left": `${u.meta.groupParent}rem` })
                  }, [
                    $("div", Ss, [
                      $("span", {
                        class: "group-column__label",
                        onClick: (E) => s(va)(u)
                      }, [
                        le(re, {
                          class: "square-icon",
                          icon: {
                            "minus-square": u.meta.showChildren,
                            "plus-square": !u.meta.showChildren
                          }
                        }, null, 8, ["icon"]),
                        $("span", null, X(u.groupKey), 1),
                        u.groupHeader.sortable ? (v(), de(re, {
                          key: 0,
                          class: "sort-icon",
                          icon: {
                            "sort-up": u.groupHeader.sortType === "asc",
                            "sort-down": u.groupHeader.sortType === "desc",
                            sort: u.groupHeader.sortType === "none"
                          },
                          onClick: De((E) => s(ft)(u.groupHeader), ["stop"])
                        }, null, 8, ["icon", "onClick"])) : z("", !0)
                      ], 8, Ns),
                      le(re, {
                        class: "group-column__icon",
                        icon: "times-circle",
                        onClick: (E) => s(fa)(u.groupHeader)
                      }, null, 8, ["onClick"])
                    ])
                  ], 4)
                ])) : (v(), h("tr", {
                  key: 1,
                  class: F([
                    { "even-row": (Q + 1) % 2 === 0 && !u.meta.selected },
                    { selected: u.meta.selected },
                    typeof _.bodyRowClassName == "string" ? _.bodyRowClassName : _.bodyRowClassName(u, Q)
                  ]),
                  "data-test-id": "table-row",
                  onClick: (E) => {
                    s(wt)(E, u, "single"), _.clickRowToExpand && s(Nt)(Q + s(tt), u, E);
                  },
                  onDblclick: (E) => s(wt)(E, u, "double")
                }, [
                  (v(!0), h(ue, null, Ce(s(et), (E, Ue) => {
                    var Tt;
                    return v(), h("td", {
                      key: Ue,
                      "data-test-id": `table-row-${E}-column`,
                      style: me([
                        Bt(E, "td"),
                        !Ue && u.meta.groupParent && { "padding-left": `${u.meta.groupParent}rem` },
                        !Ue && s(Pt)[u.meta.uniqueIndex] && { "padding-left": `${s(Pt)[u.meta.uniqueIndex]}rem` }
                      ]),
                      class: F([{
                        shadow: E === s(It),
                        "can-expand": E === "expand",
                        exactMatch: u.meta.exactMatchColumns.includes(E)
                        // eslint-disable-next-line max-len
                      }, typeof _.bodyItemClassName == "string" ? _.bodyItemClassName : _.bodyItemClassName(E, Ue), `direction-${s(r)}`]),
                      onClick: (We) => E === "expand" ? s(Nt)(Q + s(tt), u, We) : null
                    }, [
                      s(L)[`row-${E}`] ? ee(_.$slots, `row-${E}`, pe($e({ key: 0 }, u)), void 0, !0) : s(L)[`row-${E.toLowerCase()}`] ? ee(_.$slots, `row-${E.toLowerCase()}`, pe($e({ key: 1 }, u)), void 0, !0) : E === "expand" ? (v(), h("i", {
                        key: 2,
                        class: F(["expand-icon", { expanding: s(St).includes(u.meta.uniqueIndex) }])
                      }, null, 2)) : E === "checkbox" ? (v(), h("div", ws, [
                        s(Oe) ? (v(), de(re, {
                          key: 0,
                          class: "expand-children-icon",
                          icon: {
                            "plus-square": !u.meta.showChildren,
                            "minus-square": u.meta.showChildren
                          },
                          style: me({ visibility: (Tt = u.meta.children) != null && Tt.length ? "visible" : "hidden" }),
                          onClick: (We) => s(ia)(We, u)
                        }, null, 8, ["icon", "style", "onClick"])) : z("", !0),
                        le(Aa, {
                          checked: u.meta.selected,
                          class: F({ "has-children": s(Oe) }),
                          onChange: (We) => s(ua)(u)
                        }, null, 8, ["checked", "class", "onChange"])
                      ])) : (v(), h(ue, { key: 4 }, [
                        Mt(X(s(cs)(E, u)), 1)
                      ], 64))
                    ], 14, Is);
                  }), 128))
                ], 42, $s)),
                s(it) && !u.groupHeader && s(St).includes(u.meta.uniqueIndex) ? (v(), h("tr", {
                  key: 2,
                  class: F([
                    { "even-row": (Q + 1) % 2 === 0 },
                    typeof _.bodyExpandRowClassName == "string" ? _.bodyExpandRowClassName : _.bodyExpandRowClassName(u, Q)
                  ])
                }, [
                  $("td", {
                    colspan: s(_e).length,
                    class: "expand"
                  }, [
                    u.expandLoading ? (v(), de(Za, {
                      key: 0,
                      class: "expand-loading"
                    })) : z("", !0),
                    ee(_.$slots, "expand", pe(at(u)), void 0, !0)
                  ], 8, Bs)
                ], 2)) : z("", !0)
              ], 64))), 128)),
              ee(_.$slots, "body-append", pe(at({
                rows: s(qe),
                pagination: {
                  isFirstPage: s(Ee),
                  isLastPage: s(Re),
                  currentPaginationNumber: s(ie),
                  maxPaginationNumber: s(Pe),
                  nextPage: s(He),
                  prevPage: s(Fe),
                  updatePage: s(Ne)
                },
                headers: s(_e)
              })), void 0, !0)
            ], 2)) : z("", !0)
          ]),
          s(P) ? (v(), h("div", Ts, [
            Ls,
            $("div", As, [
              s(Ae) ? ee(_.$slots, "loading", { key: 0 }, void 0, !0) : (v(), de(Ka, { key: 1 }))
            ])
          ])) : z("", !0),
          !s(qe).length && !s(P) ? (v(), h("div", Ms, X(_.emptyMessage), 1)) : z("", !0)
        ], 2),
        _.hideFooter ? z("", !0) : (v(), h("div", Rs, [
          _.hideRowsPerPage ? z("", !0) : (v(), h("div", Es, [
            Mt(X(_.rowsPerPageMessage) + " ", 1),
            le(za, {
              modelValue: s(ge),
              "onUpdate:modelValue": se[1] || (se[1] = (u) => At(ge) ? ge.value = u : null),
              "rows-items": s(gt)
            }, null, 8, ["modelValue", "rows-items"])
          ])),
          $("div", Hs, [
            _.paginationWithInput ? (v(), h("span", Fs, X(s(ie)) + " " + X(s(b)) + " " + X(s(Pe)), 1)) : (v(), h("span", qs, X(`${s(bt)}–${s(xt)}`) + " " + X(s(b)) + " " + X(s(Ve)), 1))
          ]),
          s(j) ? ee(_.$slots, "pagination", pe($e({ key: 1 }, {
            isFirstPage: s(Ee),
            isLastPage: s(Re),
            currentPaginationNumber: s(ie),
            maxPaginationNumber: s(Pe),
            nextPage: s(He),
            prevPage: s(Fe)
          })), void 0, !0) : (v(), de(Fn, {
            key: 2,
            "is-first-page": s(Ee),
            "is-last-page": s(Re),
            "has-double-arrows": _.paginationWithInput,
            onClickNextPage: s(He),
            onClickPrevPage: s(Fe),
            onClickFirstPage: s(yt),
            onClickLastPage: s(ht)
          }, Pa({ _: 2 }, [
            _.buttonsPagination ? {
              name: "buttonsPagination",
              fn: Rt(() => [
                le(tn, {
                  "current-pagination-number": s(ie),
                  "max-pagination-number": s(Pe),
                  onUpdatePage: s(Ne)
                }, null, 8, ["current-pagination-number", "max-pagination-number", "onUpdatePage"])
              ])
            } : void 0,
            _.paginationWithInput ? {
              name: "paginationWithInput",
              fn: Rt(() => [
                le(On, {
                  "current-pagination-number": s(ie),
                  "max-pagination-number": s(Pe),
                  onUpdatePage: s(Ne)
                }, null, 8, ["current-pagination-number", "max-pagination-number", "onUpdatePage"])
              ])
            } : void 0
          ]), 1032, ["is-first-page", "is-last-page", "has-double-arrows", "onClickNextPage", "onClickPrevPage", "onClickFirstPage", "onClickLastPage"]))
        ]))
      ], 2)
    ]));
  }
});
const Ds = /* @__PURE__ */ ce(zs, [["__scopeId", "data-v-b0b5f14c"]]);
typeof window < "u" && window.Vue && window.Vue.createApp({}).component("Vue3EasyDataTable", Ds);
export {
  Ds as default
};
