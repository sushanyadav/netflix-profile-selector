"use client";

import {
  AnimatePresence,
  MotionConfig,
  cubicBezier,
  motion,
  useAnimate,
} from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const debounce = (fn: Function, ms: number) => {
  let timeout: NodeJS.Timeout;
  return function (...args: any) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), ms);
  };
};

let timer;

export const Homepage = () => {
  const items = [
    {
      name: "Person 1",
      id: "person-1",
      className: "bg-red-400",
      imgUrl: "/1.jpg",
    },
    {
      name: "Person 2",
      id: "person-2",
      className: "bg-green-400",
      imgUrl: "/2.jpg",
    },
    {
      name: "Person 3",
      id: "person-3",
      className: "bg-purple-400",
      imgUrl: "/3.png",
    },
  ] as const;

  const [activeItem, setActiveItem] =
    useState<(typeof items)[number]>(undefined);

  const divRef = useRef<HTMLDivElement>(null);

  const [scope, animate] = useAnimate();
  const [loading, setLoading] = useState(false);
  const [animationState, setAnimationState] = useState<
    "idle" | "animating" | "done"
  >("idle");

  useEffect(() => {
    if (!divRef.current) return;

    const targetScopePosition = () => {
      const rectForTargetPosition = divRef.current.getBoundingClientRect();
      const rectForScopePosition = scope.current.getBoundingClientRect();

      const divDimensions = {
        width: rectForTargetPosition.width,
        height: rectForTargetPosition.height,
      };

      const scopeDimensions = {
        width: rectForScopePosition.width,
        height: rectForScopePosition.height,
      };

      const x =
        rectForTargetPosition.left -
        rectForScopePosition.left -
        scopeDimensions.width / 2;

      const y =
        rectForTargetPosition.top -
        rectForScopePosition.top -
        scopeDimensions.height / 2 +
        divDimensions.height * 1.5;

      return { x, y };
    };

    const x = targetScopePosition().x;
    const y = targetScopePosition().y;

    const animation = async () => {
      setAnimationState("animating");
      await sleep(2000);
      try {
        animate(
          ".nfLoader",
          {
            opacity: 0,
          },
          {
            duration: 0.1,
          }
        );

        await animate(
          "#name",
          {
            opacity: 0,
          },
          {
            duration: 0.1,
          }
        );

        animate(
          "#activeItemContainer",
          {
            x: [0, x, x],
          },
          {
            type: "keyframes",
            ease: "linear",
            duration: 0.6,
          }
        );

        await animate(
          "#activeItem",
          {
            y: [0, -y + 90, y],
            scale: [0.4, 0.2],
          },
          {
            type: "keyframes",
            ease: cubicBezier(0, 1, 0.95, 1),
            duration: 0.5,
          }
        );
        animate(
          "#activeItem",
          {
            y: [y, y + 10, y - 2],
            scale: [0.2, 0.23, 0.2],
          },
          {
            type: "keyframes",
            ease: "easeOut",
            duration: 0.4,
          }
        );

        animate(
          "#border-top",
          {
            opacity: 1,
          },
          {
            duration: 0.4,
            delay: 0.1,
          }
        );
        setAnimationState("done");
      } catch (error) {
        console.error(error);
      }
    };

    activeItem && animation();
  }, [activeItem, animate, scope]);

  useEffect(() => {
    const onResize = async () => {
      setLoading(true);
      await sleep(200);
      setLoading(false);
      setActiveItem(undefined);
    };

    window.addEventListener("resize", debounce(onResize, 200));

    return () => {
      window.removeEventListener("resize", debounce(onResize, 200));
    };
  }, [animate, scope, divRef]);

  if (loading) {
    return (
      <div className="grid place-items-center min-h-screen text-center bg-[#0a0a0a]">
        <div className="nfLoader"></div>
      </div>
    );
  }

  return (
    <MotionConfig
      transition={{
        type: "spring",
        damping: 10,
        stiffness: 80,
        mass: 0.6,
      }}
    >
      <div className="w-full h-20 z-20 sticky py-4  max-w-lg mx-auto px-5">
        <Image
          width={128}
          height={128}
          src="/logo.png"
          alt=""
          className="h-10 w-10 object-contain"
        />
      </div>
      <div className="grid fixed inset-0 border-x border-[rgba(187,_192,_223,_0.06)] place-items-center min-h-[100dvh] max-w-lg text-center mx-auto">
        <div
          aria-hidden
          className="absolute z-[1000] bottom-0 origin-bottom-right right-0 pointer-events-none h-32 w-32 md:h-48 md:w-48 translate-y-1.5 md:translate-y-0 scale-[0.2]"
          ref={divRef}
        ></div>
        <div
          ref={scope}
          className="grid grid-cols-2 gap-x-4 gap-y-5 md:gap-x-6 md:gap-y-10"
        >
          <AnimatePresence>
            {activeItem && (
              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  if (animationState !== "animating") {
                    setActiveItem(undefined);
                    timer = setTimeout(() => {
                      setAnimationState("idle");
                    }, 1000);
                  }
                }}
                id="overlay"
                className="fixed inset-0 bg-black"
              >
                <div className="max-w-lg w-full h-full flex items-end mx-auto border-x border-[rgba(187,_192,_223,_0.15)]">
                  <motion.div
                    initial={{
                      opacity: 0,
                    }}
                    id="border-top"
                    className="w-full h-[72px] border-t border-[rgba(187,_192,_223,_0.15)]"
                  ></motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {activeItem && (
              <div className="absolute pointer-events-none z-40 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                <motion.div>
                  <motion.button id="activeItemContainer" className="space-y-2">
                    <motion.img
                      whileTap={{ scale: 0.95 }}
                      src={activeItem.imgUrl}
                      id="activeItem"
                      transition={{
                        layout: {
                          type: "spring",
                          bounce: 0.35,
                        },
                      }}
                      style={{
                        borderRadius: "8px",
                      }}
                      layoutId={`user-${activeItem.id}`}
                      className={`h-32 w-32 md:h-48 md:w-48 object-center object-cover`}
                    />
                  </motion.button>
                  <motion.h2
                    id="name"
                    layoutId={`user-${activeItem.id}-name`}
                    className="text-gray-300 group-hover:text-white transition-colors duration-500"
                  >
                    {activeItem.name}
                  </motion.h2>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { delay: 0 } }}
                  transition={{ delay: 0.1 }}
                  className="nfLoader mx-auto mt-6 -translate-x-8"
                />
              </div>
            )}
          </AnimatePresence>

          {items.map((item, index) => {
            return (
              <motion.button
                key={item.id}
                onClick={() => {
                  if (animationState === "idle") {
                    setActiveItem(item);
                    clearTimeout(timer);
                  }
                }}
                className="group space-y-1.5 md:space-y-2"
                transition={{
                  type: "spring",
                  damping: 10,
                  stiffness: 70,
                  mass: 0.6,
                  delay: index * 0.1,
                }}
                initial={{
                  opacity: 0,
                  scale: 0,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
              >
                <motion.img
                  transition={{
                    layout: {
                      type: "spring",
                      damping: 10,
                      stiffness: 90,
                      mass: 0.6,
                    },
                  }}
                  style={{
                    borderRadius: "8px",
                  }}
                  whileTap={{ scale: 0.95 }}
                  src={item.imgUrl}
                  layoutId={`user-${item.id}`}
                  className={`w-20 h-20 md:w-28 md:h-28 ${item.className} object-center object-cover`}
                />
                <motion.h2
                  transition={{
                    layout: {
                      type: "tween",
                      ease: "circOut",
                      delay: 0.2,
                    },
                  }}
                  layoutId={`user-${item.id}-name`}
                  className="text-gray-300 text-sm md:tex-base group-hover:text-white transition-colors duration-500"
                >
                  {item.name}
                </motion.h2>
              </motion.button>
            );
          })}

          <motion.div
            transition={{
              type: "spring",
              damping: 10,
              stiffness: 70,
              mass: 0.6,
              delay: 3 * 0.1,
            }}
            initial={{
              opacity: 0,
              scale: 0,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
          >
            <div
              style={{
                borderRadius: "8px",
              }}
              className="w-20 h-20 md:w-28 md:h-28 text-white grid place-items-center border-gray-500 border"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                className="w-10 h-10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <div className="mt-1.5 md:mt-2 text-sm md:tex-base text-gray-300">
              Add profile
            </div>
          </motion.div>
        </div>
      </div>
    </MotionConfig>
  );
};
