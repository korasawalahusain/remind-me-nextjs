import { cache } from "react";
import SuperJSON from "superjson";
import { unstable_cache } from "next/cache";

type InputFunction<I extends object, O> = (value?: I) => Promise<O>;

export default function fetch<I extends object, O>(
  fn: InputFunction<I, O>,
  keys?: string[],
  opts: { revalidate?: number | false; tags?: string[] } = {}
) {
  const wrap = async (input: string) => {
    const parsedInput = SuperJSON.parse<I>(input);
    const result = await fn(parsedInput);
    return SuperJSON.stringify(result);
  };

  const cachedFn = unstable_cache(cache(wrap), keys, opts);

  return async (input: I) => {
    const stringifiedInput = SuperJSON.stringify(input);
    const result = await cachedFn(stringifiedInput);
    return SuperJSON.parse<O>(result);
  };
}
