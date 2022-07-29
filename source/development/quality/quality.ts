import {AgentsManager} from "../../sections/agents/managers/agents-manager";
import {DataProvider} from "../../model/data-provider";
import {randomBytes} from "crypto";

let agentsManager = new AgentsManager(new DataProvider());

let agents_ =
    [
        [
            'debbie_dare73',
            'debbie.dare@yahoo.com',
            'rabarajiciyuqebe',
            'voluptatem voluptas numquam voluptatem'
        ],
        [
            'gail.bergstrom',
            'gail.bergstrom4@hotmail.com',
            'xeyeremogocezela',
            'cum consequuntur sint adipisci'
        ]
    ];

let agent_ = agents_[1];

agentsManager.validate([agent_[0], agent_[2]]).then(value => console.log(value));
agentsManager.validate([agent_[1], agent_[2]]).then(value => console.log(value));
agentsManager.validate([agent_[3]]).then(value => console.log(value));
agentsManager.validate([agent_[3] + randomBytes(0x10).toString("hex")]).then(value => console.log(value));

