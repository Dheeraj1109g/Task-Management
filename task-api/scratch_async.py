import asyncio
import time


async def fake_api_call(name: str, seconds: float) -> str:
    await asyncio.sleep(seconds)  # stands in for waiting on network or database
    return f"{name} done"


async def sequential():
    start = time.perf_counter()
    for name in ["A", "B", "C"]:
        await fake_api_call(name, 1)
    print(f"sequential: {time.perf_counter() - start:.1f}s")


async def concurrent():
    start = time.perf_counter()
    await asyncio.gather(
        fake_api_call("A", 1),
        fake_api_call("B", 1),
        fake_api_call("C", 1),
    )
    print(f"concurrent: {time.perf_counter() - start:.1f}s")


asyncio.run(sequential())
asyncio.run(concurrent())