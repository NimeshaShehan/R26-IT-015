Section 1 — What is this project?

Q1 What is your research component?

A Federated Learning-based e-waste forecasting system for Sri Lanka. It predicts how much electronic waste will be generated in each district — up to 12 months ahead — without sharing any raw data between locations.


Q2 Why does Sri Lanka need this?

Sri Lanka generates around 108,000 metric tons of e-waste per year (Global E-Waste Monitor 2024). There is no system to predict where or when surges will happen. Collection centres get overwhelmed, resources are wasted, and planning is purely reactive.

Q3 Who benefits from this system?

The Central Environment Authority (CEA) for collection planning, the Ministry of Environment for budget decisions, Municipal Councils for district-level operations, recycling centres for capacity management, and the World Bank / UNDP for green policy funding.



Section 2 — The research problem

Q4 What is wrong with existing forecasting systems?
Gap
Two critical gaps exist. First, existing tools treat all of Sri Lanka as one average — they ignore district-level differences. Second, they require raw data to be shared between locations, which is a privacy and legal risk under Sri Lanka's Data Protection Act 2022.

Q5 Why do district-level differences matter?
Gap
Colombo (high income, high density) generates ~18,000 MT/year. Kandy spikes during Avurudu but drops in monsoon season. Galle spikes in tourist season. A single national model trained on averages misses all of these local patterns — leading to wrong predictions for every district.

Q6 Why is sharing raw data a problem?
Gap
Government and municipal data contains sensitive information. Sharing it centralises risk — one server breach exposes everything. It also violates Sri Lanka's Data Protection Act 2022, meaning any system requiring raw data sharing cannot be legally deployed in practice.

Q7 Has anyone solved this before?
Gap
No. Papers on e-waste forecasting do not use Federated Learning. Papers on Federated Learning in waste management only do image classification, not forecasting. No Sri Lanka-specific e-waste prediction system exists. This combination — FL + BiLSTM + Sri Lanka + explainability — is the first of its kind.

