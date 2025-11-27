# stockmarketbot

StockMarketBot is a proof-of-concept application designed to explore whether AI models can generate reliable and actionable stock market insights.
It runs fully automated paper-trading strategies powered by AI decisions in real-time market conditions — without risking any real money. The app provides a transparent, live view of the bot’s performance, including daily and monthly returns, recent trades, open positions, and overall portfolio growth.
The goal is simple: observe, measure, and evaluate how effectively (or not) AI can interpret markets and make profitable trading decisions over time.

## Technologies Used

[![React](https://img.shields.io/badge/React-000000?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Next JS](https://img.shields.io/badge/Next-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![BetterAuth](https://img.shields.io/badge/BetterAuth-000000?style=for-the-badge&logo=data:image/svg+xml;base64,CiAgICA8c3ZnIHdpZHRoPSI1MDAiIGhlaWdodD0iNTAwIiB2aWV3Qm94PSIwIDAgNTAwIDUwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxyZWN0IHdpZHRoPSI1MDAiIGhlaWdodD0iNTAwIiBmaWxsPSJibGFjayIvPgogICAgPHJlY3QgeD0iNjkiIHk9IjEyMSIgd2lkdGg9Ijg2Ljk4NzkiIGhlaWdodD0iMjU5IiBmaWxsPSJ3aGl0ZSIvPgogICAgPHJlY3QgeD0iMzM3LjU3NSIgeT0iMTIxIiB3aWR0aD0iOTIuNDI0NyIgaGVpZ2h0PSIyNTkiIGZpbGw9IndoaXRlIi8+CiAgICA8cmVjdCB4PSI0MjcuMjgyIiB5PSIxMjEiIHdpZHRoPSI4My40NTU1IiBoZWlnaHQ9IjE3NC41MiIgdHJhbnNmb3JtPSJyb3RhdGUoOTAgNDI3LjI4MiAxMjEpIiBmaWxsPSJ3aGl0ZSIvPgogICAgPHJlY3QgeD0iNDMwIiB5PSIyOTYuNTQ0IiB3aWR0aD0iODMuNDU1NSIgaGVpZ2h0PSIxNzcuMjM4IiB0cmFuc2Zvcm09InJvdGF0ZSg5MCA0MzAgMjk2LjU0NCkiIGZpbGw9IndoaXRlIi8+CiAgICA8cmVjdCB4PSIyNTIuNzYyIiB5PSIyMDQuNDU1IiB3aWR0aD0iOTIuMDg4OCIgaGVpZ2h0PSI5Ni43NzQxIiB0cmFuc2Zvcm09InJvdGF0ZSg5MCAyNTIuNzYyIDIwNC40NTUpIiBmaWxsPSJ3aGl0ZSIvPgogICAgPC9zdmc+CiAgICA=)](https://www.better-auth.com/)
[![Tailwind](https://img.shields.io/badge/Tailwind-000000?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)](https://ui.shadcn.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-000000?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Grok](https://img.shields.io/badge/Grok-000000?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjZmZmIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGhlaWdodD0iMWVtIiBzdHlsZT0iZmxleDpub25lO2xpbmUtaGVpZ2h0OjEiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjFlbSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+R3JvazwvdGl0bGU+PHBhdGggZD0iTTkuMjcgMTUuMjlsNy45NzgtNS44OTdjLjM5MS0uMjkuOTUtLjE3NyAxLjEzNy4yNzIuOTggMi4zNjkuNTQyIDUuMjE1LTEuNDEgNy4xNjktMS45NTEgMS45NTQtNC42NjcgMi4zODItNy4xNDkgMS40MDZsLTIuNzExIDEuMjU3YzMuODg5IDIuNjYxIDguNjExIDIuMDAzIDExLjU2Mi0uOTUzIDIuMzQxLTIuMzQ0IDMuMDY2LTUuNTM5IDIuMzg4LTguNDJsLjAwNi4wMDdjLS45ODMtNC4yMzIuMjQyLTUuOTI0IDIuNzUtOS4zODMuMDYtLjA4Mi4xMi0uMTY0LjE3OS0uMjQ4bC0zLjMwMSAzLjMwNXYtLjAxTDkuMjY3IDE1LjI5Mk03LjYyMyAxNi43MjNjLTIuNzkyLTIuNjctMi4zMS02LjgwMS4wNzEtOS4xODQgMS43NjEtMS43NjMgNC42NDctMi40ODMgNy4xNjYtMS40MjVsMi43MDUtMS4yNWE3LjgwOCA3LjgwOCAwIDAwLTEuODI5LTFBOC45NzUgOC45NzUgMCAwMDUuOTg0IDUuODNjLTIuNTMzIDIuNTM2LTMuMzMgNi40MzYtMS45NjIgOS43NjQgMS4wMjIgMi40ODctLjY1MyA0LjI0Ni0yLjM0IDYuMDIyLS41OTkuNjMtMS4xOTkgMS4yNTktMS42ODIgMS45MjVsNy42Mi02LjgxNSI+PC9wYXRoPjwvc3ZnPg==)](https://x.ai/api)
[![Alpaca Markets](https://img.shields.io/badge/Alpaca-000000?style=for-the-badge&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAXwAAAF8BAMAAAA+yR35AAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAA9QTFRFAAAA////8fHx5+fn7Ozs07xSNQAAAAV0Uk5TAP//f88Bio61AAAFG0lEQVR4nO3db3LaVhSGcdnJ1zbpCjJZQadL6NK7gywhC2hKsgLXQHCR+oKOdP7cK/E8HzKjGZv8OHMlgxDwNKzv6ePw4et4++C4uVUEz+9+fP3nMN5++e4VLSN4fvfIv/JPtwvy84dPX8bblf4A/tuCuWwX+iP4F+/07hQUwv/pn24XFMM/z3uz/LN3encKCuKfvNO7U1AQ/+Sd3p2CovhH73S7oCj+cfw74het/jD+67i3zH/1Tu9OQXH8l+974tesnjx+yfjhXzrsil+y+AP5v/+1af7Lj8l2weqBf2nj/KfDpvnT4M8TPL8L3xn8W8GfJ3h+F76zR+T/ZvqpLvkzI7+qR/6fX+Z/5mf9PV1ZgO+Qv0jfHd+2x17q7UyDfac91Rl/2crp7SThspXT2ynahSunN/7S4Y8vlUnLyF+68Pua/uKlM3R15Fm8dI5185jn8zpIwaHTwl+zdI4VjN/CX7V0juWP38BfO/yK8Rv4q4dfMP55/vrhF4x/nv/HV8fNZ49/nu9YO/njn+V71s6QPv5Zvmv46eOf4zuHnz3+Ob5z+Nnjhz9T6uqZ4buXfvL4Z/j+4W+dn7p67vMD1k7u+O/zI4afOv4980PWTurqgT/b87eQm1Hd5ccs/czFX8LPWz075gct/SFx9eyYH7V2ElcPfEtZq2e//Lg9F/6N4FvKepn0Dj9wz007csK3tHF+1r4L3xR8FXxTSYee3fIjHzM04IcOv5wfO/xqfrC+mq+WztM/1xtdXFN7gy8X/ujY3TNf6seCjvmathm+PmZuhX/jusfxw5aFfxbq+Ldg2+DfdHkOPGX8264Rv5PL+f/Hv+265vdyOf+Uf2eq1/zFF8TX8O9N9Zq/+OFoCf/umph+cuWiKvj3WQfbj+kq+LHPUEYV8KMf41+Xz8/UF/ATl04+P3X28HXwTcFX/XfkST3wwJfBN5XOz9134av28phn8/yVbyq2xeN91X74zx9S/odzBc91M/ddnqqr4JviNJVqwUlCVxX897+k/B/HSs4w562e9ifIXcFXTV5dSVs97V8ccgVfteCVRVdF/Kzxt39Z2lX7iwJctb8kw1UZP2f87a/ncVXHTxl/4cVgGeNvfymeq/YXQrpqfxmqq1J+/Pg7uIbZUy0/fPzVbz8IPtvPmz9Uu33rTay/nj+8+zXu/2nAj5x/C/4Qdw8a8aPuQDP+Oe9hFL4Kvin4Kvim4Kvgm2rLdz9ygK+Cbwq+Cr4p+KrH4Pf6MfzwTcFXwTcFX/UQfP/1qU35/tO08FXwTcFXwTcFX/UQfP/1DfBV8E3BV8E3BV8F3xR8FXxTLfn9flEqfFPwVfBNwVfBNwVfBd8UfNUj8Pv9bnv4puCr4JuCr4JvqiE/4n1z8FXwTcFXwTcFX/UA/IgPnICvgm8Kvgq+Kfiq/fNDPqQEvgq+Kfgq+Kbgq/bPD/l0P/gq+Kbgq+Cbgq+Cbwq+Cr6pZvyYD9Tlw1xV8E3BV8E3BV8F3xR8FXxT8FXz/JhvAIGvgm8Kvgq+KfiqvfODvvYGvgq+Kfgq+Kbgq/bOD/q6Rfgq+Kbgq+Cbgq/aOX/j3zEK/xR8FXxT8FXwTTXiR323PXwVfFPwVfBNwVdV8d/9HXRD46r4wyHqhkbBt7Vxfs6+C99YyuqBbyxl9dTxU8Y/w496rngqwV/Jf/4WeGPnKvlxve1H8BsEv2XwW2blB/7RjQx+y+C3DH7L4LfMyO/0jy78psFvGfyWwW/ZG/9fDc0JqipZ5cQAAAAASUVORK5CYII=)](https://alpaca.markets)

## Installation

To run the stockmarketbot app:

1. Navigate to the project directory:

   ```bash
   cd stockmarketbot
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   - Create a `.env` file. As
   - Add all env variables from your vercel postgres db

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open your browser and visit `http://localhost:3000`.