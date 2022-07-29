import {AgentsManager} from "./agents-manager";
import {DataProvider} from "../../fundamental/data-provider";

let agents = [
    [
        'amy4',
        'amy50@gmail.com',
        'puniwofokoricuwa',
        'vel in non doloribus'
    ],
    [
        'rita86',
        'rita.herman10@hotmail.com',
        'quhisokexeyifeza',
        'itaque et et vel'
    ]
];

let agentsManager = new AgentsManager(new DataProvider());

describe("AgentsManager", () =>
{
    it("amy4", () =>
    {
        expect(agentsManager.validate([agents[0][3]])).toBeTruthy();
    });
    
    it("rita86", () =>
    {
        expect(agentsManager.validate([agents[1][3]])).toBeTruthy();
    });
});
