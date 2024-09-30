"use server";

import axios from 'axios';

export const axiosFetch = async (url, payload) => {
	const data = JSON.stringify(payload);

	const config = {
		method: 'post',
		url,
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'X-IDAPTIVE-NATIVE-CLIENT': 'true',
		},
		data: data,
	};

	return axios.request(config).then((response) => response.data);
};

export const authenticate = async (user, password) => {

    if (!user || !password) {
        return res.status(400).send({ error: 'Invalid user or password' });
    }

    // stage 1 start auth process

    try {
        const stage1Result = await axiosFetch(
            'https://cswg.my.idaptive.app/Security/StartAuthentication',
            {
                TenantId: 'aaz0904',
                User: user,
                Version: '1.0',
            },
        );
    
        console.log('stage1Result', stage1Result);
    
        if (!stage1Result || !stage1Result.success || !stage1Result.Result) {
            return res.status(400).send({ error: 'Invalid user or password' });
        }
    
        const { Result } = stage1Result;
        const { Challenges, SessionId } = Result;
    
        if (!Challenges || !Challenges.length) {
            return res.status(400).send({ error: 'Invalid user or password' });
        }
    
        const { Mechanisms } = Challenges[0];
    
        if (!Mechanisms || !Mechanisms.length) {
            return res.status(400).send({ error: 'Invalid user or password' });
        }
    
        const { MechanismId } = Mechanisms[0];
    
        // stage 2
        const stage2Result = await axiosFetch(
            'https://cswg.my.idaptive.app/Security/AdvanceAuthentication',
            {
                TenantId: 'aaz0904',
                User: user,
                Version: '1.0',
                SessionId: SessionId,
                MechanismId: MechanismId,
                Action: 'Answer',
                Answer: password,
            },
        );
    
        console.log('stage2Result', stage2Result);
    
        if (!stage2Result || !stage2Result.success || !stage2Result.Result) {
            return res.status(400).send({ error: 'Invalid user or password' });
        }
    
        return stage2Result.Result;
    } catch (error) {
        console.log('error: ', error);
    }    
};