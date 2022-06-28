import { ethers } from "hardhat";
import { Contract } from "ethers";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import * as dotenv from "dotenv";

dotenv.config();

export async function deployContract<C extends Contract>(
    name: string,
    signer: SignerWithAddress,
    ...args: any[]
): Promise<C> {
    const f = await ethers.getContractFactory(name, signer);
    const c = await f.deploy(...args);
    return c as C;
}