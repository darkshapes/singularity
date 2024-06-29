## SabreUI - A [ComfyUI](https://github.com/comfyanonymous/ComfyUI) frontend

Lets create a more inviting and visually-pleasing ComfyUI Frontend using Typescript and React!
##
#### Our Design Principles :

> ##### I. Insight is an essential right and paves the way for safeguarding others' rights.
> ##### II. Our task is to dissolve obstacles, inviting self-realization, connection, and understanding.
> ##### III. Let the transcendence of manual tasks give way to exploration, inspiration and creativity.
> ##### IV. Together, today, we refine our world with the systematic and spontaneous.
> ##### V: As much as necessary, with as little as possible.

##

> [!TIP]
>
> ##### For best results, we recommend using SabreUI with 3D graphics cards. Please ensure you have the current driver installed for your card. [NVIDIA.](https://www.nvidia.com/Download/index.aspx) [AMD.](https://www.amd.com/en/support/download/drivers.html)

Installation :  [Windows](#windows)   [MacOS](#macos)   [Linux](#linux)

<a name="windows">

  ### Windows
> [!WARNING]
> 
> ##### Optimizations are not available for manual or portable ComfyUI installs. Windows users should setup [Windows Subsystem for Linux](https://learn.microsoft.com/en-us/windows/wsl/install-manual#downloading-distributions/) before attempting manual installation.
<details><summary>

>   ##### Installation using WSL (Windows Subsystem for Linux) </summary>

> 1. ###### Allow WSL through your firewall using Powershell with the following command in CMD:
> ```
> powershell New-NetFirewallRule -Program “%SystemRoot%\System32\wsl.exe” -Action Allow -Profile Domain, Private -DisplayName “Allow WSL” > -Description “Allow WSL” -Direction Outbound
> ```
> 2. ###### Enable Control Flow Guard
> ```
> powershell Set-ProcessMitigation -Name vmcompute.exe -Enable CFG
> ```
> 3. ##### [Download And Install Ubuntu LTS for WSL](https://learn.microsoft.com/en-us/windows/wsl/install-manual#downloading-distributions) 
> #### OR
> 4.  ##### Download and Install Ubuntu LTS with Windows Subsystem for Linux from Command Line
> ```
> wsl --install -d Ubuntu --web-download
> ```
> 5. ##### Open WSL
> ```
> wsl
> ```
</details><details><summary>

>  ##### Manual Windows Installation </summary>

> 1. ##### Download [Python](https://www.python.org/downloads/windows/)
> 2. ##### Check the boxes for `Install For All` users and `Add Python.exe to PATH` in the installer
>
>   ![Screenshot 2024-06-29 161256](https://github.com/MaxTretikov/SabreUI/assets/91800957/9071ae92-1d6e-41a6-82e3-dbb6bdfd94b2)
>
> 3. ##### Download [Git](https://git-scm.com/download/win)
> 4. ##### In the installer, ensure the Git LFS box is marked
>
>    ![snip](https://github.com/MaxTretikov/SabreUI/assets/91800957/7e95f13b-e894-4499-a551-6389b62bfab6)
>
> 5. ##### Set Git to be usable from Windows Command line
>
>    ![Screenshot 2024-06-29 192323](https://github.com/MaxTretikov/SabreUI/assets/91800957/65171ec1-3b3f-4de4-b163-98607e4386fd)
>
> 6. ##### Use Windows' default console window
>
>    ![Screenshot 2024-06-29 192409](https://github.com/MaxTretikov/SabreUI/assets/91800957/850d0437-db37-4358-872b-956e9d417645)
</details><details>
<summary>

 <a name="macos" /> 
  
### MacOS </summary>

> 1. ##### Install [Xcode]https://apps.apple.com/us/app/xcode/id497799835
>   
> 2. ##### Follow Apple's Instructions [Pytorch Install Instructions](https://developer.apple.com/metal/pytorch/)

</details></details>
<details open><summary>

<a name="graphics " />
Preparing Graphics Cards
</summary>

<details><summary>

##### NVIDIA Instructions </summary>

> 1. ##### a. Get NVIDIA keys
> ```
> wget https://developer.download.nvidia.com/compute/cuda/repos/wsl-ubuntu/x86_64/cuda-keyring_1.1-1_all.deb
> ```

> OR
> 1. ##### b. Add NVIDIA to your repo sources file
> ```
> sudo 'echo "http://developer.download.nvidia.com/compute/cuda/repos/wsl-ubuntu/x86_64 /" > /etc/apt/sources.list.d/cuda.list'
> ```

> 2. ##### Install Key
> ```
> sudo dpkg -i cuda-keyring_1.1-1_all.deb
> ```

> 3. ##### Install CUDA
> ```
> sudo apt-get -y install cuda-toolkit-12-5
> ```
</details>
<details><summary>

##### AMD Instructions </summary>
> 
> 1. ###### 
</details>

- ##### Update your repository and install upgrades

<details>
 <summary>

##### WSL/Ubuntu/Debian: </summary>
  ```
 sudo apt-get -y update & sudo apt-get -y upgrade
```
</details>
<details><summary>

##### Redhat/Fedora: </summary>
  ```
  sudo dnf update & sudo dnf upgrade
```
</details>
<details><summary>

##### Arch: </summary>
  ```
  sudo pacman -Syu
```
</details>
</details>
<details><summary>

##### WSL Only: Ensure Latest Python and Git</summary>
```
sudo apt-get -y install python3 python3-venv python3-pip git
```
</details>

##### Create a virtual environment in your current directory
##### We recommend this be a directory you can remember, and not directly in /home, /Program Files, or /Windows
```
python3 -m venv .venv
```
##### Activate the Environment
```
source .venv/bin/activate
```
##### Windows MANUAL Installation Only : Activate the Environment
```
.venv/Scripts/activate
```
##### Install prerequisites
```
pip install packaging wheel ninja
```

##### Install PyTorch 
```
NVIDIA: pip3 install torch==2.3.0+cu121 torchvision --index-url=https://download.pytorch.org/whl/cuda121
AMD: pip3 install torch==2.3.0+cu121 torchvision --index-url=https://download.pytorch.org/whl/cuda121
```

##### Install XFORMERS (Unavailable for Windows MANUAL Installation)
```
pip install xformers==0.0.26.post1
```
##### Install Flash-attention (Unavailable for Windows MANUAL Installation)
```
pip install flash-attn --no-build-isolation
```
</details>
</details>
<details>
<summary>

<a name="sabre" />
  3: SabreUI
  
  </summary>

  > ##### The quickest way to get into SabreUI is to clone our [ComfyUI fork.](https://github.com/MaxTretikov/ComfyUI/)
  > ##### This is the purest vision we have for ComfyUI, able to switch on the fly between the classic interface and Sabre.
  > ##### Extended functionality of [ComfyUI](https://github.com/comfyanonymous/ComfyUI) will soon allow you to run SabreUI from command line option.

##### Once your virtual environment has Pytorch/XFormers/Flash-Attn, install to the current folder. This will add a new folder named `ComfyUI` in your current directory
```
git clone https://github.com/Maxtretikov/ComfyUI.git
```

##### Install the requirements to run ComfyUI
```
cd ComfyUI
pip install -r requirements.txt
```

##### Launch ComfyUI
```
python ComfyUI\main.py --output-directory /yourfoldernamehere --input-directory /yourfoldernamehere/input
```

##### Open your browser to [127.0.0.1:8188](https://127.0.0.1:8188)

##### Choose SabreUI from the settings menu 

</details>


  <img width="1481" alt="image (2)" src="https://github.com/exdysa/SabreUI/assets/91800957/fbacfdb4-3941-4da5-aa3c-79787a3f4d22">
