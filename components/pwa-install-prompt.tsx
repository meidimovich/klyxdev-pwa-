"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Check, Download, Plus, Share, X } from "lucide-react";

import { useLocale } from "@/components/locale-provider";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const dismissedStorageKey = "klyxdev-install-dismissed-v1";
const mobileQuery = "(max-width: 1023px)";
let appInstalled = false;
const installedSubscribers = new Set<() => void>();

function subscribeToMobile(callback: () => void) {
  const query = window.matchMedia(mobileQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getMobileSnapshot() {
  return window.matchMedia(mobileQuery).matches;
}

function subscribeToStaticSnapshot() {
  return () => {};
}

function getIOSSnapshot() {
  const userAgent = window.navigator.userAgent;
  return (
    /iPhone|iPad|iPod/i.test(userAgent) ||
    (window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1)
  );
}

function getSafariSnapshot() {
  const userAgent = window.navigator.userAgent;
  return /Safari/i.test(userAgent) && !/CriOS|FxiOS|EdgiOS|OPiOS/i.test(userAgent);
}

function subscribeToInstalled(callback: () => void) {
  installedSubscribers.add(callback);
  const notifyInstalled = () => {
    appInstalled = true;
    for (const subscriber of installedSubscribers) subscriber();
  };
  window.addEventListener("appinstalled", notifyInstalled);
  const displayMode = window.matchMedia("(display-mode: standalone)");
  displayMode.addEventListener("change", callback);
  return () => {
    installedSubscribers.delete(callback);
    window.removeEventListener("appinstalled", notifyInstalled);
    displayMode.removeEventListener("change", callback);
  };
}

function getInstalledSnapshot() {
  return (
    appInstalled ||
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in window.navigator && window.navigator.standalone === true)
  );
}

function getServerSnapshot() {
  return false;
}

function isPromptDismissed() {
  try {
    return localStorage.getItem(dismissedStorageKey) === "true" || localStorage.getItem(dismissedStorageKey) === "installed";
  } catch (error) {
    console.error("Could not read PWA installation preference", error);
    return false;
  }
}

function rememberPromptDismissal(value: "true" | "installed") {
  try {
    localStorage.setItem(dismissedStorageKey, value);
  } catch (error) {
    console.error("Could not save PWA installation preference", error);
  }
}

export function PwaInstallPrompt() {
  const { t } = useLocale();
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);
  const isMobile = useSyncExternalStore(subscribeToMobile, getMobileSnapshot, getServerSnapshot);
  const isIOS = useSyncExternalStore(subscribeToStaticSnapshot, getIOSSnapshot, getServerSnapshot);
  const isSafari = useSyncExternalStore(subscribeToStaticSnapshot, getSafariSnapshot, getServerSnapshot);
  const isInstalled = useSyncExternalStore(subscribeToInstalled, getInstalledSnapshot, getServerSnapshot);
  const [hasInstallPrompt, setHasInstallPrompt] = useState(false);
  const [isPromptVisible, setIsPromptVisible] = useState(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const [installError, setInstallError] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    const viewportQuery = window.matchMedia(mobileQuery);
    let promptTimer: number | undefined;

    const schedulePrompt = () => {
      if (isInstalled || !viewportQuery.matches || isPromptDismissed()) return;
      window.clearTimeout(promptTimer);
      promptTimer = window.setTimeout(() => setIsPromptVisible(true), 900);
    };

    const handleInstallPrompt = (event: Event) => {
      event.preventDefault();
      deferredPrompt.current = event as BeforeInstallPromptEvent;
      setHasInstallPrompt(true);
      schedulePrompt();
    };

    const handleInstalled = () => {
      deferredPrompt.current = null;
      setHasInstallPrompt(false);
      setIsPromptVisible(false);
      rememberPromptDismissal("installed");
    };

    const handleViewportChange = (event: MediaQueryListEvent) => {
      if (event.matches && (isIOS || deferredPrompt.current)) schedulePrompt();
      else setIsPromptVisible(false);
    };

    window.addEventListener("beforeinstallprompt", handleInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);
    viewportQuery.addEventListener("change", handleViewportChange);

    if (isIOS && !isInstalled) schedulePrompt();

    return () => {
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
      viewportQuery.removeEventListener("change", handleViewportChange);
      window.clearTimeout(promptTimer);
    };
  }, [isIOS, isInstalled]);

  useEffect(() => {
    if (!isInstructionsOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsInstructionsOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isInstructionsOpen]);

  if (!isMobile || isInstalled || (!isIOS && !hasInstallPrompt)) return null;

  const dismissPrompt = () => {
    rememberPromptDismissal("true");
    setIsPromptVisible(false);
  };

  const install = async () => {
    const prompt = deferredPrompt.current;
    if (!prompt) {
      setInstallError(true);
      setIsInstructionsOpen(true);
      return;
    }

    setIsInstalling(true);
    try {
      await prompt.prompt();
      const choice = await prompt.userChoice;
      deferredPrompt.current = null;
      setIsPromptVisible(false);
      if (choice.outcome === "accepted") {
        setHasInstallPrompt(false);
        rememberPromptDismissal("installed");
      } else {
        rememberPromptDismissal("true");
      }
    } catch (error) {
      console.error("Could not open the PWA installation prompt", error);
      deferredPrompt.current = null;
      setInstallError(true);
      setIsInstructionsOpen(true);
      setIsPromptVisible(false);
    } finally {
      setIsInstalling(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setInstallError(false);
          setIsInstructionsOpen(true);
        }}
        aria-label={t("pwa.install.openHelp")}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-200 transition-colors hover:border-white/25 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#397BFF]"
      >
        <Download size={16} aria-hidden="true" />
      </button>

      {typeof document !== "undefined"
        ? createPortal(
            <>
              {isPromptVisible ? (
                <aside
                  aria-label={t("pwa.install.title")}
                  className="mobile-install-prompt fixed inset-x-3 z-[60] mx-auto max-w-lg rounded-3xl border border-white/15 bg-[#111316]/90 p-4 shadow-[0_20px_70px_rgba(0,0,0,0.55)] backdrop-blur-2xl"
                >
                  <div className="flex items-start gap-3">
                    <Image
                      src="/klyxdev-logo.png"
                      alt=""
                      width={48}
                      height={48}
                      unoptimized
                      className="h-12 w-12 shrink-0 rounded-xl object-contain"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="pr-7 text-sm font-semibold text-white">{t("pwa.install.title")}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-300">{t("pwa.install.description")}</p>
                    </div>
                    <button
                      type="button"
                      onClick={dismissPrompt}
                      aria-label={t("pwa.install.dismiss")}
                      className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#397BFF]"
                    >
                      <X size={16} aria-hidden="true" />
                    </button>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setIsInstructionsOpen(true)}
                      className="text-xs font-medium text-slate-300 underline decoration-white/25 underline-offset-4 transition-colors hover:text-white"
                    >
                      {t("pwa.install.help")}
                    </button>
                    {!isIOS ? (
                      <button
                        type="button"
                        onClick={install}
                        disabled={isInstalling}
                        className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#397BFF] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#2d68ea] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                      >
                        {t(isInstalling ? "pwa.install.installing" : "pwa.install.action")}
                      </button>
                    ) : null}
                  </div>
                </aside>
              ) : null}

              {isInstructionsOpen ? (
                <div
                  className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
                  onMouseDown={(event) => {
                    if (event.target === event.currentTarget) setIsInstructionsOpen(false);
                  }}
                >
                  <section
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="pwa-install-title"
                    className="max-h-[85dvh] w-full max-w-sm overflow-y-auto rounded-3xl border border-white/15 bg-[#111316]/95 p-5 shadow-2xl shadow-black/50"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-[#8aa9ff]">{t("pwa.install.help")}</p>
                        <h2 id="pwa-install-title" className="mt-2 text-lg font-semibold text-white">
                          {isIOS ? t("pwa.install.ios.title") : t("pwa.install.android.title")}
                        </h2>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsInstructionsOpen(false)}
                        aria-label={t("pwa.install.close")}
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-slate-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#397BFF]"
                      >
                        <X size={17} aria-hidden="true" />
                      </button>
                    </div>

                    {isIOS ? (
                      <div className="mt-5 space-y-4">
                        {!isSafari ? (
                          <p className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm leading-6 text-slate-300">
                            {t("pwa.install.ios.nonSafari")}
                          </p>
                        ) : null}
                        {[
                          { icon: Share, text: t("pwa.install.ios.step1") },
                          { icon: Plus, text: t("pwa.install.ios.step2") },
                          { icon: Check, text: t("pwa.install.ios.step3") },
                        ].map(({ icon: Icon, text }, index) => (
                          <div key={text} className="flex items-center gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-[#8aa9ff]">
                              <Icon size={18} aria-hidden="true" />
                            </span>
                            <p className="text-sm leading-6 text-slate-200">
                              <span className="mr-1 text-xs text-slate-500">0{index + 1}</span>
                              {text}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-4 text-sm leading-6 text-slate-300">
                        {installError ? t("pwa.install.unavailable") : t("pwa.install.android.description")}
                      </p>
                    )}
                  </section>
                </div>
              ) : null}
            </>,
            document.body,
          )
        : null}
    </>
  );
}
